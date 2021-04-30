using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(/=.*[A-Z]).{8,32}$", ErrorMessage = "Password must be more complex")]
        public string Password { get; set; }
        [Required]
        public string Username { get; set; }
    }
}