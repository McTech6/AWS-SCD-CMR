import prisma from '../db/prisma.js'
import { speakerApplySchema, speakerUpdateSchema } from '../utils/validation.js'
import { sendEmail } from '../../lib/email/send.js'
import { uploadImage, deleteImage } from '../utils/cloudinary.js'


// ===============================
// APPLY SPEAKER
// ===============================
export const applySpeaker = async (req, res, next) => {

    console.log("\n==============================")
    console.log("🎤 NEW SPEAKER APPLICATION")
    console.log("Body:", req.body)
    console.log("==============================")

    try {

        const validated = speakerApplySchema.parse(req.body)

        const {
            name,
            email,
            topic,
            talkTitle,
            bio,
            talkAbstract,
            company,
            linkedinUrl,
            twitterHandle,
            githubUrl,
            track,
            experienceLevel,
            photoBase64
        } = validated

        console.log("Validated:", validated)

        // check existing user
        let user = await prisma.user.findUnique({
            where: { email }
        })

        console.log("Existing user:", user)

        if (!user) {

            console.log("Creating new user...")

            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    role: "SPEAKER"
                }
            })

            console.log("User created:", user.id)
        }

        let photoUrl = null
        let photoKey = null

        // =========================
        // CLOUDINARY IMAGE UPLOAD
        // =========================

        if (photoBase64) {

            console.log("\n📷 Uploading speaker photo")
            console.log("Base64 length:", photoBase64.length)

            try {

                const uploadResult = await uploadImage(photoBase64, "speaker-photos")

                console.log("Cloudinary upload result:", uploadResult)

                photoUrl = uploadResult.url
                photoKey = uploadResult.publicId

                console.log("Photo URL:", photoUrl)
                console.log("Photo Key:", photoKey)

            } catch (err) {

                console.error("Cloudinary Upload Failed")
                console.error(err)

            }

        }

        console.log("Creating speaker record...")

        const speaker = await prisma.speaker.create({

            data: {

                userId: user.id,

                topic,
                talkTitle,

                talkAbstract: talkAbstract || topic,

                bio,

                linkedinUrl,
                twitterHandle,
                githubUrl,

                track: track || "CLOUD_FUNDAMENTALS",

                experienceLevel: experienceLevel || "ZERO_TO_ONE",

                photoUrl,
                photoKey,

                status: "PENDING"
            }

        })

        console.log("Speaker created:", speaker.id)

        res.status(201).json({
            success: true,
            message: "Application submitted",
            data: speaker
        })

    } catch (error) {

        console.error("Apply Speaker Error:", error)

        next(error)
    }

}


// ===============================
// GET APPROVED SPEAKERS (PUBLIC)
// ===============================
export const getSpeakers = async (req, res, next) => {

    console.log("\nGET APPROVED SPEAKERS")

    try {
        const { track, search } = req.query

        const validTracks = ['CLOUD_FUNDAMENTALS', 'DEVOPS', 'AI_ML', 'SECURITY', 'OPEN_SOURCE']
        const trackFilter = track && validTracks.includes(track) ? track : undefined

        const where = {
            status: "APPROVED",
            ...(trackFilter && { track: trackFilter }),
            ...(search && {
                OR: [
                    { user: { name: { contains: search, mode: 'insensitive' } } },
                    { talkTitle: { contains: search, mode: 'insensitive' } },
                    { topic: { contains: search, mode: 'insensitive' } },
                    { bio: { contains: search, mode: 'insensitive' } }
                ]
            })
        }

        const speakers = await prisma.speaker.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { featured: 'desc' }
        })

        console.log("Speakers found:", speakers.length)

        res.json({
            success: true,
            data: speakers
        })

    } catch (error) {

        console.error(error)
        next(error)
    }
}


// ===============================
// GET ALL SPEAKERS (ADMIN)
// ===============================
export const getAllSpeakers = async (req, res, next) => {

    console.log("\nADMIN GET ALL SPEAKERS")

    try {

        const speakers = await prisma.speaker.findMany({

            include: {
                user: true
            },

            orderBy: {
                submittedAt: "desc"
            }

        })

        console.log("Total speakers:", speakers.length)

        res.json({
            success: true,
            data: speakers
        })

    } catch (error) {

        console.error(error)

        next(error)
    }

}


// ===============================
// GET SINGLE SPEAKER
// ===============================
export const getSpeakerById = async (req, res, next) => {

    console.log("\nGET SPEAKER BY ID:", req.params.id)

    try {

        const speaker = await prisma.speaker.findUnique({

            where: { id: req.params.id },

            include: {
                user: true
            }

        })

        if (!speaker) {

            return res.status(404).json({
                success: false,
                message: "Speaker not found"
            })

        }

        res.json({
            success: true,
            data: speaker
        })

    } catch (error) {

        console.error(error)

        next(error)
    }

}


// ===============================
// APPROVE SPEAKER
// ===============================
export const approveSpeaker = async (req, res, next) => {

    console.log("\nAPPROVE SPEAKER:", req.params.id)

    try {

        const speaker = await prisma.speaker.update({

            where: { id: req.params.id },

            data: {
                status: "APPROVED",
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            },

            include: { user: true }

        })

        console.log("Speaker approved:", speaker.user.email)

        // Send email
        try {

            await sendEmail({

                to: speaker.user.email,

                subject: "Speaker Application Approved",

                template: "speaker-approved",

                variables: {
                    name: speaker.user.name,
                    talkTitle: speaker.talkTitle
                }

            })

            console.log("Approval email sent")

        } catch (err) {

            console.error("Email failed:", err)

        }

        res.json({
            success: true,
            message: "Speaker approved",
            data: speaker
        })

    } catch (error) {

        console.error(error)

        next(error)
    }

}


// ===============================
// REJECT SPEAKER
// ===============================
export const rejectSpeaker = async (req, res, next) => {

    console.log("\nREJECT SPEAKER:", req.params.id)

    try {

        const { reviewNote } = req.body

        const speaker = await prisma.speaker.update({

            where: { id: req.params.id },

            data: {
                status: "REJECTED",
                reviewNote,
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            },

            include: { user: true }

        })

        console.log("Speaker rejected")

        // Send rejection email
        try {
            await sendEmail({
                to: speaker.user.email,
                subject: "Speaker Application Update",
                template: "speaker-rejected",
                variables: {
                    name: speaker.user.name,
                    talkTitle: speaker.talkTitle,
                    reviewNote: reviewNote || "Please feel free to reapply with an updated proposal."
                }
            })
            console.log("Rejection email sent")
        } catch (err) {
            console.error("Email failed:", err)
        }

        res.json({
            success: true,
            data: speaker
        })

    } catch (error) {

        console.error(error)

        next(error)
    }

}


// ===============================
// UPDATE SPEAKER
// ===============================
export const updateSpeaker = async (req, res, next) => {

    console.log("\nUPDATE SPEAKER:", req.params.id)

    try {

        const validated = speakerUpdateSchema.parse(req.body)

        const { photoBase64, ...updateData } = validated

        let photoUrl
        let photoKey

        if (photoBase64) {

            console.log("Uploading new photo")

            const upload = await uploadImage(photoBase64, "speaker-photos")

            photoUrl = upload.url
            photoKey = upload.publicId

            console.log("New image uploaded:", photoUrl)

        }

        const speaker = await prisma.speaker.update({

            where: { id: req.params.id },

            data: {

                ...updateData,

                ...(photoUrl && { photoUrl }),
                ...(photoKey && { photoKey })

            }

        })

        res.json({
            success: true,
            data: speaker
        })

    } catch (error) {

        console.error(error)

        next(error)
    }

}


// ===============================
// FEATURE SPEAKER
// ===============================
export const featureSpeaker = async (req, res, next) => {

    console.log("\nFEATURE SPEAKER:", req.params.id)

    try {

        const speaker = await prisma.speaker.findUnique({
            where: { id: req.params.id }
        })

        const updated = await prisma.speaker.update({

            where: { id: req.params.id },

            data: {
                featured: !speaker.featured
            }

        })

        console.log("Featured toggled:", updated.featured)

        res.json({
            success: true,
            data: updated
        })

    } catch (error) {

        console.error(error)

        next(error)
    }

}


// ===============================
// DELETE SPEAKER
// ===============================
export const deleteSpeaker = async (req, res, next) => {

    console.log("\nDELETE SPEAKER:", req.params.id)

    try {

        const speaker = await prisma.speaker.findUnique({
            where: { id: req.params.id }
        })

        if (!speaker) {

            return res.status(404).json({
                success: false,
                message: "Speaker not found"
            })
        }

        if (speaker.photoKey) {

            console.log("Deleting Cloudinary image:", speaker.photoKey)

            await deleteImage(speaker.photoKey)

        }

        await prisma.speaker.delete({
            where: { id: req.params.id }
        })

        console.log("Speaker deleted")

        res.json({
            success: true,
            message: "Speaker deleted"
        })

    } catch (error) {

        console.error(error)

        next(error)
    }

}

//