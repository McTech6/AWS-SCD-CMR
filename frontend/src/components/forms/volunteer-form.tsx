"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Button,
    Input,
    Spinner,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { ChevronRight } from "lucide-react";

const volunteerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number required"),
    university: z.string().min(2, "University is required"),
    cloudClub: z.string().optional(),
    skills: z.string().min(2, "You must select an area of contribution"),
});

type VolunteerData = z.infer<typeof volunteerSchema>;

const SKILL_AREAS = [
    "Graphic Design",
    "Content Writing",
    "Video Editing",
    "Social Media",
    "Photography",
    "Creative Strategy & Branding",
    "Logistics & Coordination"
];

interface VolunteerFormProps {
    onSubmit: (data: VolunteerData) => void;
    isSubmitting?: boolean;
}

export function VolunteerForm({ onSubmit, isSubmitting = false }: VolunteerFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<VolunteerData>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            cloudClub: "",
            skills: ""
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-2xl mx-auto">
            <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-[var(--text-1)] text-center">Your Details</h3>
                
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="+234 800 000 0000"
                        {...register("phone")}
                        error={errors.phone?.message}
                    />
                </div>
                
                <Input
                    label="University / Institution"
                    placeholder="University of Lagos"
                    {...register("university")}
                    error={errors.university?.message}
                />
                
                <Input
                    label="Which AWS Cloud Club do you belong to (if any)?"
                    placeholder="AWS Cloud Club UNILAG"
                    {...register("cloudClub")}
                    error={errors.cloudClub?.message}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-2)]">
                        Area of Contribution
                    </label>
                    <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger 
                                    className={`w-full bg-[var(--void)]/50 border-[var(--border)] h-12 text-sm ${errors.skills ? 'border-[var(--error)]' : ''}`}
                                >
                                    <SelectValue placeholder="Select where you can assist best" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--surface)] border-[var(--border)] text-[var(--text-1)]">
                                    {SKILL_AREAS.map(area => (
                                        <SelectItem key={area} value={area} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                                            {area}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.skills && (
                        <p className="text-xs text-[var(--error)] mt-1">{errors.skills.message}</p>
                    )}
                </div>
            </div>

            <Button
                variant="primary"
                size="lg"
                className="w-full h-14 font-display text-lg shadow-glow"
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
                        Apply to Volunteer
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                )}
            </Button>
        </form>
    );
}
