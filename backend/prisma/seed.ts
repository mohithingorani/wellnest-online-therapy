import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const specialties = [
    { name: 'Anxiety' },
    { name: 'Depression' },
    { name: 'Trauma' },
    { name: 'Stress Management' },
    { name: 'Relationships' },
    { name: 'Family Therapy' },
    { name: 'Cognitive Behavioral Therapy' },
    { name: 'Grief Counseling' },
    { name: 'Self-Esteem' },
    { name: 'OCD' },
  ];

  for (const spec of specialties) {
    await prisma.specialty.upsert({
      where: { name: spec.name },
      update: {},
      create: spec,
    });
  }

  const anxiety = await prisma.specialty.findUnique({ where: { name: 'Anxiety' } });
  const depression = await prisma.specialty.findUnique({ where: { name: 'Depression' } });
  const trauma = await prisma.specialty.findUnique({ where: { name: 'Trauma' } });
  const stress = await prisma.specialty.findUnique({ where: { name: 'Stress Management' } });
  const relationships = await prisma.specialty.findUnique({ where: { name: 'Relationships' } });
  const cbt = await prisma.specialty.findUnique({ where: { name: 'Cognitive Behavioral Therapy' } });
  const grief = await prisma.specialty.findUnique({ where: { name: 'Grief Counseling' } });
  const selfEsteem = await prisma.specialty.findUnique({ where: { name: 'Self-Esteem' } });

  const therapists = [
    {
      name: 'Dr. Sarah Mitchell',
      experience: 12,
      specialtyIds: [anxiety!.id, depression!.id, stress!.id],
    },
    {
      name: 'Dr. James Chen',
      experience: 8,
      specialtyIds: [trauma!.id, relationships!.id, cbt!.id],
    },
    {
      name: 'Dr. Emily Rodriguez',
      experience: 15,
      specialtyIds: [depression!.id, selfEsteem!.id, anxiety!.id],
    },
    {
      name: 'Dr. Michael Thompson',
      experience: 10,
      specialtyIds: [anxiety!.id, stress!.id, relationships!.id],
    },
    {
      name: 'Dr. Priya Sharma',
      experience: 7,
      specialtyIds: [trauma!.id, cbt!.id, depression!.id],
    },
    {
      name: 'Dr. David Kim',
      experience: 20,
      specialtyIds: [grief!.id, relationships!.id, anxiety!.id],
    },
  ];

  for (const t of therapists) {
    await prisma.therapist.create({
      data: {
        name: t.name,
        experience: t.experience,
        specialities: {
          connect: t.specialtyIds.map((id) => ({ id })),
        },
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