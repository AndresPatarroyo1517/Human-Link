using Konscious.Security.Cryptography;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Human_Link_Web.Server.Custom
{
    public class PasswordHasher
    {
        private const int reducedTimeCost = 2; // Valor bajo para acelerar el hashing
        private const int reducedMemoryCost = 32768; // Reduce la memoria a 32 MB
        private const int degreeOfParallelism = 1; // Reducido para evitar sobrecarga de hilos

        public PasswordHasher() { }

        // Método para hacer el hash de la contraseña
        public string Hash(string password)
        {
            // Convertir la contraseña a un arreglo de bytes
            var passwordBytes = Encoding.UTF8.GetBytes(password);

            // Generamos el salt
            var salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            using (var argon2 = new Argon2id(passwordBytes))
            {
                // Configuramos el Argon2 con los parámetros adecuados
                argon2.Salt = salt;
                argon2.DegreeOfParallelism = degreeOfParallelism;
                argon2.MemorySize = reducedMemoryCost;
                argon2.Iterations = reducedTimeCost;

                // Realizamos el hash de la contraseña
                var hash = argon2.GetBytes(32); // Obtener 32 bytes del hash

                // Combinamos el salt con el hash y lo convertimos a base64
                return Convert.ToBase64String(salt) + "$" + Convert.ToBase64String(hash);
            }
        }

        // Método para verificar si la contraseña ingresada coincide con el hash almacenado
        public bool Verify(string storedPasswordHash, string inputPassword)
        {
            // Separamos el salt del hash almacenado
            var parts = storedPasswordHash.Split('$');
            var salt = Convert.FromBase64String(parts[0]);
            var storedHash = Convert.FromBase64String(parts[1]);

            // Convertir la contraseña ingresada a un arreglo de bytes
            var inputPasswordBytes = Encoding.UTF8.GetBytes(inputPassword);

            using (var argon2 = new Argon2id(inputPasswordBytes))
            {
                // Configuramos el Argon2 con los mismos parámetros que se usaron al almacenar el hash
                argon2.Salt = salt;
                argon2.DegreeOfParallelism = degreeOfParallelism;
                argon2.MemorySize = reducedMemoryCost;
                argon2.Iterations = reducedTimeCost;

                // Verificamos si la contraseña ingresada coincide con el hash almacenado
                var computedHash = argon2.GetBytes(32);

                return CompareHashes(computedHash, storedHash);
            }
        }

        // Método para comparar dos hashes
        private bool CompareHashes(byte[] computedHash, byte[] storedHash)
        {
            if (computedHash.Length != storedHash.Length)
                return false;

            int result = 0;
            for (int i = 0; i < computedHash.Length; i++)
            {
                result |= computedHash[i] ^ storedHash[i];
            }
            return result == 0;
        }


        // Método para validar que la contraseña cumpla con los requisitos de seguridad
        public bool IsPasswordValid(string password)
        {
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