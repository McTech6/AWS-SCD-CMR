import prisma from './src/db/prisma.js';

async function updateSpeakers() {
  try {
    console.log('Starting speaker updates...');
    
    // Find Delia Ayoko
    const delia = await prisma.speaker.findFirst({
      where: {
        user: {
          name: {
            contains: 'Delia Ayoko',
            mode: 'insensitive'
          }
        }
      },
      include: { user: true }
    });

    if (delia) {
      await prisma.speaker.update({
        where: { id: delia.id },
        data: { track: 'COMMUNITY_FOCUSED' }
      });
      console.log('✅ Updated Delia Ayoko: Set track to COMMUNITY_FOCUSED');
    } else {
      console.log('❌ Delia Ayoko not found in speakers');
    }

    // Find Linuce Demanou Kitio
    const linuce = await prisma.speaker.findFirst({
      where: {
        user: {
          name: {
            contains: 'Linuce',
            mode: 'insensitive'
          }
        }
      },
      include: { user: true }
    });

    if (linuce) {
      await prisma.speaker.update({
        where: { id: linuce.id },
        data: { 
          track: 'COMMUNITY_FOCUSED',
          talkTitle: 'The Difference Between Those Who Succeed and Those Who Don’t Isn’t Skill'
        }
      });
      console.log('✅ Updated Linuce Demanou Kitio: Set track to COMMUNITY_FOCUSED and fixed talk title');
    } else {
      console.log('❌ Linuce Demanou Kitio not found in speakers');
    }

  } catch (error) {
    console.error('❌ Error updating speakers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSpeakers();
