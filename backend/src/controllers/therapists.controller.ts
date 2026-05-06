import { Request, Response } from "express";
import {
  CreateTherapistSchema,
  TherapistSchema,
  UpdateTherapistSchema,
} from "../inputs";
import { z } from "zod";
import {prisma} from "../db/prisma"

const TherapistArraySchema = z.array(TherapistSchema);
const TherapistIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function getTherapists(req: Request, res: Response) {
  try {
    const therapists = await prisma.therapist.findMany({
      include: {
        specialities: true,
        sessionTypes: true,
        therapyTypes: true,
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

export async function getTherapistById(req: Request, res: Response) {
  try {
    const parsedParams = TherapistIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid therapist id",
        errors: z.flattenError(parsedParams.error),
      });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { id: parsedParams.data.id },
      include: {
        specialities: true,
        sessionTypes: true,
        therapyTypes: true,
      },
    });

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    const finalParsed = TherapistSchema.parse(therapist);
    return res.json({
      success: true,
      data: finalParsed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch therapist",
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
                errors: z.flattenError(parsed.error),
            });
        }
        const therapist = await prisma.therapist.create({
            data: {
                name: parsed.data.name,
                experience: parsed.data.experience,
                gender: parsed.data.gender || "Prefer not to say",
                specialities: {
                    connect: parsed.data.specialtyIds?.map((id) => ({ id })) || [],
                },
            }
        });

        const therapistWithSpecialties = await prisma.therapist.findUnique({
            where: { id: therapist.id },
            include: { specialities: true, sessionTypes: true, therapyTypes: true },
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

export const updateTherapist = async (req: Request, res: Response) => {
  try {
    const parsedParams = TherapistIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid therapist id",
        errors: z.flattenError(parsedParams.error),
      });
    }

    const parsedBody = UpdateTherapistSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: z.flattenError(parsedBody.error),
      });
    }

    const existingTherapist = await prisma.therapist.findUnique({
      where: { id: parsedParams.data.id },
      select: { id: true },
    });

    if (!existingTherapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    await prisma.therapist.update({
      where: { id: parsedParams.data.id },
      data: {
        name: parsedBody.data.name,
        experience: parsedBody.data.experience,
        ...(parsedBody.data.gender !== undefined
          ? { gender: parsedBody.data.gender }
          : {}),
        ...(parsedBody.data.specialtyIds !== undefined
          ? {
              specialities: {
                set: parsedBody.data.specialtyIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });

    const updatedTherapist = await prisma.therapist.findUnique({
      where: { id: parsedParams.data.id },
      include: { specialities: true, sessionTypes: true, therapyTypes: true },
    });

    const finalParsed = TherapistSchema.parse(updatedTherapist);
    return res.json({
      success: true,
      data: finalParsed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update therapist",
    });
  }
};

export const deleteTherapist = async (req: Request, res: Response) => {
  try {
    const parsedParams = TherapistIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid therapist id",
        errors: z.flattenError(parsedParams.error),
      });
    }

    const existingTherapist = await prisma.therapist.findUnique({
      where: { id: parsedParams.data.id },
      select: { id: true },
    });

    if (!existingTherapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    await prisma.therapist.delete({
      where: { id: parsedParams.data.id },
    });

    return res.json({
      success: true,
      message: "Therapist deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete therapist",
    });
  }
};