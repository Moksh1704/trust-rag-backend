import dns from 'dns/promises';
import net from 'net';

function isPrivateIP(ip) {

  return (
    ip.startsWith('10.') ||
    ip.startsWith('127.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('169.254.')
  );
}

export async function validateURL(url) {

  try {

    const parsedUrl = new URL(url);

    // Allow only HTTP/HTTPS
    if (
      parsedUrl.protocol !== 'http:' &&
      parsedUrl.protocol !== 'https:'
    ) {
      throw new Error(
        'Only HTTP/HTTPS URLs allowed'
      );
    }

    // DNS lookup
    const { address } =
      await dns.lookup(parsedUrl.hostname);

    // Prevent SSRF/private IP access
    if (
      net.isIP(address) &&
      isPrivateIP(address)
    ) {
      throw new Error(
        'Private/internal IPs not allowed'
      );
    }

    return true;

  } catch (error) {

    throw new Error(
      `Invalid URL: ${error.message}`
    );
  }
}