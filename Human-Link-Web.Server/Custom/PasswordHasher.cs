using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace Human_Link_Web.Server.Custom
{
    public class PasswordHasher
    {
        private const int saltSize = 128 / 8;
        private const int keySize = 256 / 8;
        private const int iterations = 10000;
        private static readonly HashAlgorithmName hashAlgorithmName = HashAlgorithmName.SHA256;
        private static readonly char delimiter = ';';

        public PasswordHasher() { }

        public string Hash(string password)
        {
            // Generar un nuevo salt aleatorio para cada hash
            var salt = RandomNumberGenerator.GetBytes(saltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithmName, keySize);
            var result = string.Join(delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));

            return result;
        }

        public bool Verify(string passwordHash, string inputPassword)
        {
            var elements = passwordHash.Split(delimiter);
            var salt = Convert.FromBase64String(elements[0]);
            var hash = Convert.FromBase64String(elements[1]);
            var hashInput = Rfc2898DeriveBytes.Pbkdf2(inputPassword, salt, iterations, hashAlgorithmName, keySize);
            return CryptographicOperations.FixedTimeEquals(hash, hashInput);
        }

        //Usar este método para evitar un doble encriptamiento o posibles errores
        public bool IsPasswordPotentiallyHashed(string password)
        {
            // Verifica si la contraseña parece estar hasheada
            // Asumiendo que usamos BCrypt, que genera hashes de 60 caracteres que empiezan con $2a$, $2b$ o $2y$
            return password.Length >= 60 &&
                   (password.StartsWith("$2a$") ||
                    password.StartsWith("$2b$") ||
                    password.StartsWith("$2y$"));
        }

        //Usar este método cuando se quieran validar la calidad de las contraseñas
        public bool IsPasswordValid(string password)
        {
            // Validar que la contraseña cumple con requisitos mínimos de seguridad
            var hasNumber = new Regex(@"[0-9]+");
            var hasUpperChar = new Regex(@"[A-Z]+");
            var hasLowerChar = new Regex(@"[a-z]+");
            var hasSpecialChar = new Regex(@"[!@#$%^&*(),.?"":{}|<>]+");
            var hasMinLength = new Regex(@".{8,}");

            return !string.IsNullOrEmpty(password) &&
                   hasNumber.IsMatch(password) &&
                   hasUpperChar.IsMatch(password) &&
                   hasLowerChar.IsMatch(password) &&
                   hasSpecialChar.IsMatch(password) &&
                   hasMinLength.IsMatch(password);
        }
    }
}
