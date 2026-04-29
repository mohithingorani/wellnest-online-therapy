import { Request, Response } from "express";
import { CreateTherapistSchema, TherapistSchema } from "../inputs";
import { z } from "zod";
import {prisma} from "../db/prisma"

const TherapistArraySchema = z.array(TherapistSchema);

export async function getTherapists(req: Request, res: Response) {
  try {
    const therapists = await prisma.therapist.findMany({
      include: {
        specialities: true,
      },
    });

    const parsed = TherapistArraySchema.parse(therapists);

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch therapists",
    });
  }
}

export const createTherapist = async (req: Request, res: Response) => {
    try {
        const parsed = CreateTherapistSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten(),
            });
        }
        const therapist = await prisma.therapist.create({
            data: {
                name: parsed.data.name,
                experience: parsed.data.experience,
                specialities: {
                    connect: parsed.data.specialtyIds?.map((id) => ({ id })) || [],
                },
            }
        });

        const therapistWithSpecialties = await prisma.therapist.findUnique({
            where: { id: therapist.id },
            include: { specialities: true },
        });

        const finalParsed = TherapistSchema.parse(therapistWithSpecialties);

        return res.json({
            success: true,
            data: finalParsed,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create therapist",
        });
    }
}