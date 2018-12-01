import {
  ALGORITHM,
  KEY_ALGORITHM,
  createKey,
  encrypt,
  decrypt,
} from '@/storage';

[[ALGORITHM, 'aes-256-ctr'], [KEY_ALGORITHM, 'sha256']].forEach(([a, b]) => {
  test(`${a}=${b}`, () => {
    expect(a).toEqual(b);
  });
});

test('createKey should return key of length 16', () => {
  expect(createKey('t').length).toEqual(32);
});

test('createKey should return partly hash for "superkey"', () => {
  expect(createKey('superkey')).toEqual('mRJGvkG0RqScUNDjt/vP3oFGAWys9UAa');
});

test('encrypt and decrypt', () => {
  const text = 'The text that should be encrypted';
  const key = 'superduper key which is very secret';

  const encrypted = encrypt(text, key);
  const decrypted = decrypt(encrypted, key);

  expect(decrypted).toEqual(text);
});
