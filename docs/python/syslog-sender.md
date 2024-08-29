---
title: SysLog Sender
---

Script to send a message to a SysLog server.

```python title="syslog_sender.py"
import socket
import sys

def send_syslog_message(message, server='localhost', port=514):
    """
    Sends a message to the syslog server.

    :param message: Message to send
    :param server: Syslog server address (default 'localhost')
    :param port: Syslog server port (default 514)
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        sock.sendto(message.encode('utf-8'), (server, port))
        print(f"Message successfully sent to {server}:{port}")
    except Exception as e:
        print(f"Error sending message: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py 'Your message' [server] [port]")
        sys.exit(1)

    message = sys.argv[1]
    server = sys.argv[2] if len(sys.argv) > 2 else 'localhost'
    port = int(sys.argv[3]) if len(sys.argv) > 3 else 514

    send_syslog_message(message, server, port)
```

Usage:

```bash
python3 syslog_sender.py "Test message" <server> 514
```
