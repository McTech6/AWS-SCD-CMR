import 'dotenv/config';
import prisma from './src/db/prisma.js';

async function main() {
    const sponsors = await prisma.sponsor.findMany({
        select: { 
            id: true, 
            name: true, 
            logoUrl: true,
            logoKey: true,
            tier: true, 
            website: true, 
            visible: true,
            status: true,
            sortOrder: true 
        },
        orderBy: [{ createdAt: 'asc' }]
    });

    console.log(`\n📋 ALL SPONSORS (${sponsors.length} total)\n`);
    console.log('='.repeat(100));

    sponsors.forEach((s, i) => {
        const isCloudinary = s.logoUrl?.includes('cloudinary');
        console.log(`\n[${i + 1}] ${s.name}`);
        console.log(`    Tier:     ${s.tier ?? 'N/A'} | Status: ${s.status} | Visible: ${s.visible}`);
        console.log(`    Logo URL: ${s.logoUrl ?? '⚠️  MISSING'} ${isCloudinary ? '☁️' : ''}`);
        console.log(`    Logo Key: ${s.logoKey ?? 'N/A'}`);
    });

    // Cloudinary-only summary
    const cloudinarySponsors = sponsors.filter(s => s.logoUrl?.includes('cloudinary'));
    console.log('\n\n' + '='.repeat(100));
    console.log(`\n☁️  CLOUDINARY LOGOS ONLY (${cloudinarySponsors.length} sponsors):\n`);
    console.log('='.repeat(100));
    cloudinarySponsors.forEach(s => {
        console.log(`\n  Name:      ${s.name}`);
        console.log(`  Status:    ${s.status} | Tier: ${s.tier ?? 'N/A'}`);
        console.log(`  Image URL: ${s.logoUrl}`);
        if (s.logoKey) console.log(`  Image Key: ${s.logoKey}`);
    });

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
