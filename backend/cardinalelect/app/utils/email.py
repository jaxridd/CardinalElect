import random

def generate_code() -> str:
    """Returns a random 6-digit string."""
    return str(random.randint(100000, 999999))

def send_verification_email(to: str, code: str):
    """
    Temporarily prints the code to the terminal instead of sending an email.
    Replace this with real SMTP later.
    """
    print(f"\n{'='*40}")
    print(f"VERIFICATION CODE FOR: {to}")
    print(f"CODE: {code}")
    print(f"{'='*40}\n")