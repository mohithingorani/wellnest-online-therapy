import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.therapist.deleteMany();
  await prisma.sessionType.deleteMany();
  await prisma.therapyType.deleteMany();
  await prisma.language.deleteMany();
  await prisma.concerns.deleteMany();
  await prisma.admin.deleteMany();

  const users = [
    { email: 'john@example.com', name: 'John Doe', passwordHash: 'hashed_pw_john' },
    { email: 'jane@example.com', name: 'Jane Smith', passwordHash: 'hashed_pw_jane' },
    { email: 'alex@example.com', name: 'Alex Brown', passwordHash: 'hashed_pw_alex' },
    { email: 'sophia@example.com', name: 'Sophia Miller', passwordHash: 'hashed_pw_sophia' },
    { email: 'daniel@example.com', name: 'Daniel Lee', passwordHash: 'hashed_pw_daniel' },
    { email: 'olivia@example.com', name: 'Olivia White', passwordHash: 'hashed_pw_olivia' },
    { email: 'ethan@example.com', name: 'Ethan Walker', passwordHash: 'hashed_pw_ethan' },
    { email: 'mia@example.com', name: 'Mia Harris', passwordHash: 'hashed_pw_mia' },
    { email: 'noah@example.com', name: 'Noah Clark', passwordHash: 'hashed_pw_noah' },
    { email: 'ava@example.com', name: 'Ava Lewis', passwordHash: 'hashed_pw_ava' },
  ];

  const createdUsers = [];
  for (const user of users) {
    const created = await prisma.user.create({ data: user });
    createdUsers.push(created);
  }

  const sessions = [
    { sessionToken: 'token_john_1', userId: createdUsers[0].id, expiresAt: new Date('2026-05-14') },
    { sessionToken: 'token_jane_1', userId: createdUsers[1].id, expiresAt: new Date('2026-05-14') },
    { sessionToken: 'token_alex_1', userId: createdUsers[2].id, expiresAt: new Date('2026-05-14') },
    { sessionToken: 'token_sophia_1', userId: createdUsers[3].id, expiresAt: new Date('2026-05-14') },
    { sessionToken: 'token_daniel_1', userId: createdUsers[4].id, expiresAt: new Date('2026-05-14') },
    { sessionToken: 'token_olivia_1', userId: createdUsers[5].id, expiresAt: new Date('2026-05-14') },
  ];

  for (const session of sessions) {
    await prisma.session.create({ data: session });
  }

  const admins = [
    { email: 'admin@wellnest.com', name: 'Super Admin', role: 'super_admin' },
    { email: 'rahul@wellnest.com', name: 'Rahul Verma', role: 'admin' },
    { email: 'priya@wellnest.com', name: 'Priya Kapoor', role: 'moderator' },
  ];

  for (const admin of admins) {
    const passwordHash = await argon2.hash('password123');
    await prisma.admin.create({ data: { ...admin, password: passwordHash } });
  }

  const sessionTypes = [
    { name: 'Online', description: 'Video consultation sessions' },
    { name: 'Offline', description: 'In-person therapy sessions' },
    { name: 'Chat', description: 'Text-based therapy support' },
    { name: 'Group', description: 'Group counselling sessions' },
    { name: 'Emergency', description: 'Priority crisis counselling' },
  ];

  const createdSessionTypes: Record<string, number> = {};
  for (const st of sessionTypes) {
    const created = await prisma.sessionType.create({ data: st });
    createdSessionTypes[st.name] = created.id;
  }

  const therapyTypes = [
    { name: 'CBT', description: 'Cognitive Behavioral Therapy' },
    { name: 'Mindfulness', description: 'Mindfulness-based therapy' },
    { name: 'Psychodynamic', description: 'Psychodynamic therapy' },
    { name: 'Humanistic', description: 'Humanistic therapy' },
    { name: 'Solution-focused', description: 'Solution-focused therapy' },
  ];

  const createdTherapyTypes: Record<string, number> = {};
  for (const tt of therapyTypes) {
    const created = await prisma.therapyType.create({ data: tt });
    createdTherapyTypes[tt.name] = created.id;
  }

  const languages = [
    { name: 'English' },
    { name: 'Hindi' },
    { name: 'Spanish' },
    { name: 'French' },
    { name: 'German' },
    { name: 'Mandarin' },
    { name: 'Tamil' },
    { name: 'Telugu' },
    { name: 'Bengali' },
    { name: 'Marathi' },
  ];

  const createdLanguages: Record<string, number> = {};
  for (const lang of languages) {
    const created = await prisma.language.create({ data: lang });
    createdLanguages[lang.name] = created.id;
  }

  const concerns = [
    'Anxiety', 'Depression', 'Stress Management', 'Trauma', 'Relationship Issues',
    'Burnout', 'Self Esteem', 'Panic Attacks', 'OCD', 'ADHD', 'Grief',
    'Anger Management', 'Social Anxiety', 'Loneliness', 'Family Conflict'
  ];

  const createdConcerns: Record<string, string> = {};
  for (const c of concerns) {
    const created = await prisma.concerns.create({ data: { name: c } });
    createdConcerns[c] = created.id;
  }

  const therapists = [
    { name: 'Dr. Sarah Johnson', title: 'Clinical Psychologist', experience: 8, gender: 'Female', sessionTypes: ['Online', 'Chat'], concerns: ['Anxiety', 'Stress Management', 'Relationship Issues'], therapyTypes: ['CBT', 'Mindfulness'], languages: ['English', 'Hindi'] },
    { name: 'Dr. Michael Chen', title: 'Counselor', experience: 12, gender: 'Male', sessionTypes: ['Online', 'Offline'], concerns: ['Depression', 'Trauma'], therapyTypes: ['Psychodynamic', 'CBT'], languages: ['English', 'Mandarin'] },
    { name: 'Dr. Emily Davis', title: 'Clinical Psychologist', experience: 5, gender: 'Female', sessionTypes: ['Online', 'Offline', 'Chat'], concerns: ['Anxiety', 'Depression', 'Stress Management'], therapyTypes: ['CBT', 'Humanistic'], languages: ['English', 'Spanish'] },
    { name: 'Dr. Priya Sharma', title: 'Psychotherapist', experience: 10, gender: 'Female', sessionTypes: ['Online', 'Group'], concerns: ['Burnout', 'Self Esteem', 'Loneliness'], therapyTypes: ['Mindfulness', 'Solution-focused'], languages: ['English', 'Hindi', 'Tamil'] },
    { name: 'Dr. James Wilson', title: 'Clinical Psychologist', experience: 15, gender: 'Male', sessionTypes: ['Offline'], concerns: ['Trauma', 'Family Conflict'], therapyTypes: ['Psychodynamic', 'CBT'], languages: ['English'] },
    { name: 'Dr. Kavya Mehta', title: 'Counselor', experience: 7, gender: 'Female', sessionTypes: ['Online', 'Emergency'], concerns: ['Panic Attacks', 'Social Anxiety'], therapyTypes: ['CBT', 'Mindfulness'], languages: ['English', 'Hindi', 'Marathi'] },
    { name: 'Dr. Robert Taylor', title: 'Psychiatrist', experience: 18, gender: 'Male', sessionTypes: ['Offline', 'Group'], concerns: ['Anger Management', 'OCD'], therapyTypes: ['CBT', 'Psychodynamic'], languages: ['English', 'French', 'German'] },
    { name: 'Dr. Aisha Khan', title: 'Licensed Counselor', experience: 9, gender: 'Female', sessionTypes: ['Chat', 'Online'], concerns: ['Anxiety', 'ADHD'], therapyTypes: ['CBT', 'Solution-focused'], languages: ['English', 'Hindi'] },
    { name: 'Dr. Arjun Malhotra', title: 'Clinical Psychologist', experience: 11, gender: 'Male', sessionTypes: ['Online', 'Offline'], concerns: ['Depression', 'Grief'], therapyTypes: ['Humanistic', 'Psychodynamic'], languages: ['English', 'Hindi', 'Telugu'] },
    { name: 'Dr. Lisa Anderson', title: 'Mental Health Counselor', experience: 6, gender: 'Female', sessionTypes: ['Chat'], concerns: ['Self Esteem', 'Relationship Issues'], therapyTypes: ['Humanistic', 'Mindfulness'], languages: ['English', 'Spanish'] },
    { name: 'Dr. Neha Verma', title: 'Psychotherapist', experience: 4, gender: 'Female', sessionTypes: ['Online'], concerns: ['Loneliness', 'Stress Management'], therapyTypes: ['Solution-focused', 'Humanistic'], languages: ['English', 'Hindi', 'Bengali'] },
    { name: 'Dr. David Miller', title: 'Clinical Psychologist', experience: 14, gender: 'Male', sessionTypes: ['Offline', 'Emergency'], concerns: ['Trauma', 'Panic Attacks', 'Anger Management'], therapyTypes: ['CBT', 'Psychodynamic'], languages: ['English', 'German'] },
  ];

  for (const t of therapists) {
    await prisma.therapist.create({
      data: {
        name: t.name,
        title: t.title,
        experience: t.experience,
        gender: t.gender,
        sessionTypes: { connect: t.sessionTypes.map(st => ({ id: createdSessionTypes[st] })) },
        specialities: { connect: t.concerns.map(c => ({ id: createdConcerns[c] })) },
        therapyTypes: { connect: t.therapyTypes.map(tt => ({ id: createdTherapyTypes[tt] })) },
        languages: { connect: t.languages.map(lang => ({ id: createdLanguages[lang] })) },
      },
    });
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });