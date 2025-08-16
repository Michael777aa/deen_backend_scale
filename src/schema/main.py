import pyotp
import hashlib

email = "youremail@example.com"
secret_base = email + "HENNGECHALLENGE004"

# HMAC-SHA512 => first hash the secret string
hashed_secret = hashlib.sha512(secret_base.encode()).digest()

# Convert to base32 manually if needed
import base64
secret = base64.b32encode(hashed_secret).decode()

totp = pyotp.TOTP(secret, digits=10, interval=30, digest='sha512')
print(totp.now())
