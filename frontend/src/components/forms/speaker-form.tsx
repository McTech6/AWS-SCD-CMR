"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Button,
    Input,
    Textarea,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Spinner,
} from "@/components/ui";
import {
    Linkedin,
    Twitter,
    Github,
    Upload,
    Trash2,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const speakSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    topic: z.string().min(10, "Topic must be descriptive (at least 10 chars)"),
    track: z.string().min(1, "Please select a track"),
    bio: z.string().max(300, "Bio must be under 300 characters").min(20, "Please provide a brief bio (at least 20 chars)"),
    talkAbstract: z.string().min(20, "Talk abstract must be at least 20 chars"),
    experience: z.string().min(1, "Please select experience level"),
    sessionType: z.string().min(1, "Please select a session type"),
    linkedin: z.string().url("Must be a valid URL").regex(/linkedin\.com/, "Must be a LinkedIn URL"),
    twitter: z.string().optional(),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    photo: z.string().min(1, "Profile photo is required"),
    role: z.string().min(2, "Role is required"),
});

type SpeakData = z.infer<typeof speakSchema>;

interface SpeakerFormProps {
    onSubmit: (data: SpeakData, profilePhoto: string | null) => void;
    isSubmitting?: boolean;
}

export function SpeakerForm({ onSubmit, isSubmitting = false }: SpeakerFormProps) {
    const [profilePhoto, setProfilePhoto] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [photoError, setPhotoError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SpeakData>({
        resolver: zodResolver(speakSchema),
        defaultValues: {
            track: "",
            experience: "",
            sessionType: "Simple Talk",
            photo: "",
            bio: ""
        }
    });

    const bioValue = watch("bio");

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
        else if (e.type === "dragleave") setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const result = re.target?.result as string;
                    setProfilePhoto(result);
                    setValue("photo", result, { shouldValidate: true });
                    setPhotoError(null);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (re) => {
                const result = re.target?.result as string;
                setProfilePhoto(result);
                setValue("photo", result, { shouldValidate: true });
                setPhotoError(null);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data, profilePhoto))} className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-8">
                <div className="space-y-4">
                    <h3 className="font-display text-xl font-bold text-[var(--text-1)]">Personal Details</h3>
                    <Input
                        label="Full Name"
                        placeholder="Dr. Julia Cloud"
                        {...register("fullName")}
                        error={errors.fullName?.message}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="julia@example.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Current Role"
                            placeholder="Cloud Architect"
                            {...register("role")}
                            error={errors.role?.message}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-[var(--text-2)]">Experience Level</span>
                            <Select
                                onValueChange={(val) => setValue("experience", val, { shouldValidate: true })}
                                defaultValue=""
                            >
                                <SelectTrigger className={errors.experience ? "border-[var(--error)]" : ""}>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-1">Student / Beginner (0-1y)</SelectItem>
                                    <SelectItem value="1-3">Early Career (1-3y)</SelectItem>
                                    <SelectItem value="3-5">Professional (3-5y)</SelectItem>
                                    <SelectItem value="5+">Expert (5y+)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.experience && <p className="text-xs text-[var(--error)]">{errors.experience.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-[var(--text-2)]">Talk Track</span>
                            <Select
                                onValueChange={(val) => setValue("track", val, { shouldValidate: true })}
                            >
                                <SelectTrigger className={errors.track ? "border-[var(--error)]" : ""}>
                                    <SelectValue placeholder="Select track" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Serverless">Serverless</SelectItem>
                                    <SelectItem value="DevOps">DevOps</SelectItem>
                                    <SelectItem value="AI & ML">AI & ML</SelectItem>
                                    <SelectItem value="Security">Security</SelectItem>
                                    <SelectItem value="Architecture">Architecture</SelectItem>
                                    <SelectItem value="Community Focused">Community Focused</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.track && <p className="text-xs text-[var(--error)]">{errors.track.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-display text-xl font-bold text-[var(--text-1)]">Proposed Session</h3>
                    <Input
                        label="Talk Topic / Title"
                        placeholder="How I built a globally distributed database..."
                        {...register("topic")}
                        error={errors.topic?.message}
                    />
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-[var(--text-2)]">Session Type</span>
                        <Select
                            onValueChange={(val) => setValue("sessionType", val, { shouldValidate: true })}
                            defaultValue="Simple Talk"
                        >
                            <SelectTrigger className={errors.sessionType ? "border-[var(--error)]" : ""}>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Simple Talk">Simple Talk</SelectItem>
                                <SelectItem value="Interactive Demo">Interactive Demo</SelectItem>
                                <SelectItem value="Hands-on Workshop">Hands-on Workshop</SelectItem>
                                <SelectItem value="Keynote">Keynote Session</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.sessionType && <p className="text-xs text-[var(--error)]">{errors.sessionType.message}</p>}
                    </div>
                    <Textarea
                        label="Talk Abstract"
                        placeholder="Briefly describe what your talk is about..."
                        {...register("talkAbstract")}
                        error={errors.talkAbstract?.message}
                    />
                    <Textarea
                        label="Speaker Bio"
                        placeholder="Tell us about yourself..."
                        maxLength={300}
                        {...register("bio")}
                        value={bioValue}
                        error={errors.bio?.message}
                    />
                </div>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <h3 className="font-display text-xl font-bold text-[var(--text-1)]">Social Proof</h3>
                    <div className="relative">
                        <Input
                            label="LinkedIn Profile"
                            placeholder="https://linkedin.com/in/username"
                            className="pl-10"
                            {...register("linkedin")}
                            error={errors.linkedin?.message}
                        />
                        <Linkedin className="absolute left-3 top-[34px] text-[var(--text-3)]" size={18} />
                    </div>
                    <div className="relative">
                        <Input
                            label="Twitter / X Handle (Optional)"
                            placeholder="@username"
                            className="pl-10"
                            {...register("twitter")}
                        />
                        <Twitter className="absolute left-3 top-[34px] text-[var(--text-3)]" size={18} />
                    </div>
                    <div className="relative">
                        <Input
                            label="GitHub Profile (Optional)"
                            placeholder="https://github.com/username"
                            className="pl-10"
                            {...register("github")}
                        />
                        <Github className="absolute left-3 top-[34px] text-[var(--text-3)]" size={18} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-display text-xl font-bold text-[var(--text-1)]">Profile Photo *</h3>
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={cn(
                            "relative group flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:border-[var(--electric)]",
                            isDragging && "border-[var(--electric)] bg-[var(--electric)]/5 scale-[1.02]",
                            profilePhoto && "border-solid border-[var(--electric)]/50",
                            errors.photo && !profilePhoto && "border-[var(--error)]"
                        )}
                        onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                        <input
                            type="file"
                            id="photo-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />

                        {profilePhoto ? (
                            <div className="relative p-6 text-center">
                                <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--electric)] shadow-glow">
                                    <img src={profilePhoto} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                                <span className="text-xs font-mono text-[var(--success)]">Photo Ready</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setProfilePhoto(null);
                                        setValue("photo", "", { shouldValidate: true });
                                    }}
                                    className="absolute right-4 top-4 rounded-full bg-[var(--error)]/10 p-2 text-[var(--error)] transition-colors hover:bg-[var(--error)] hover:text-white"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[var(--text-3)] transition-colors group-hover:text-[var(--electric)] group-hover:border-[var(--electric)]/20">
                                    <Upload size={24} />
                                </div>
                                <p className="text-sm font-medium text-[var(--text-1)]">Drag and drop or click to upload</p>
                                <p className="mt-1 text-xs text-[var(--text-3)]">JPG, PNG or WEBP (max 5MB)</p>
                            </>
                        )}
                    </div>
                    {errors.photo && <p className="text-xs text-[var(--error)]">{errors.photo.message}</p>}
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-14 font-display text-lg shadow-glow mt-8"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Spinner className="h-5 w-5 border-2 text-white/50 border-t-white" />
                            Processing...
                        </div>
                    ) : (
                        <>
                            Sync Speaker
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
