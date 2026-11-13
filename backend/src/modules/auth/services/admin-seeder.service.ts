import bcrypt from 'bcryptjs';

import { User } from '../models/user.model.js';

const SALT_ROUNDS = 12;

const getRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

  export const seedAdmin = async (): Promise<void> => {
  const name = getRequiredEnv('ADMIN_NAME');
  const email = getRequiredEnv('ADMIN_EMAIL').toLowerCase();
  const password = getRequiredEnv('ADMIN_PASSWORD');

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must contain at least 8 characters');
  }

  const admin = await User.findOne({ email }).select(
    '+passwordHash +refreshTokenHash +tokenVersion',
  );

  if (!admin) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await User.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    console.log(`Admin account created: ${email}`);
    return;
  }

  let credentialsChanged = false;
  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  admin.name = name;
  admin.role = 'admin';
  admin.isActive = true;

  if (!passwordMatches) {
    admin.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    admin.refreshTokenHash = undefined;
    admin.tokenVersion = (admin.tokenVersion ?? 0) + 1;
    credentialsChanged = true;
  }

  await admin.save();

  console.log(
    credentialsChanged
      ? `Admin credentials updated: ${email}`
      : `Admin account ready: ${email}`,
  );
};

