package util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtil {
    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";

    public static String hashPassword(String password){
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        String saltEncoded = Base64.getEncoder().encodeToString(salt);
        String hash = Base64.getEncoder().encodeToString(pbkdf2(password.toCharArray(), salt));
        return saltEncoded + ":" + hash;
    }

    public static boolean verifyPassword(String password, String stored) {
        if (stored == null || !stored.contains(":")) {
            return false;
        }

        String[] parts = stored.split(":");
        if (parts.length < 2) {
            return false;
        }
        try {
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            String hash = Base64.getEncoder().encodeToString(pbkdf2(password.toCharArray(), salt));
            return hash.equals(parts[1]);
        } catch (IllegalArgumentException e) {
            // Handle case where Base64 decoding fails
            return false;
        }
    }

    private static byte[] pbkdf2(char[] password, byte[] salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password, salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);
            return factory.generateSecret(spec).getEncoded();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
