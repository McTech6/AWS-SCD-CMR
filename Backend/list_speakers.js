import dotenv from 'dotenv';
import prisma from './src/db/prisma.js';

dotenv.config();

async function listSpeakers() {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    console.log('--- SPEAKER LIST ---');
    console.log(JSON.stringify(speakers, (key, value) => {
        if (key === 'talkAbstract' || key === 'bio') {
            return value ? value.substring(0, 50) + '...' : value;
        }
        return value;
    }, 2));
    console.log('--- END OF LIST ---');
    console.log('Total counts: ' + speakers.length);
  } catch (error) {
    console.error('❌ Error fetching speakers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listSpeakers();
