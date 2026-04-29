import { Request, Response } from "express";
import { CreateSpecialtySchema, SpecialtyArraySchema, SpecialtySchema } from "../inputs";
import { z } from "zod";
import {prisma} from "../db/prisma"
export async function getSpecialties(req: Request, res: Response) {
  try {
    const specialties = await prisma.specialty.findMany();

    const parsed = SpecialtyArraySchema.parse(specialties);

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch specialties",
    });
  }
}

export async function createSpecialty(req: Request, res: Response) {
  try {
    const parsed = CreateSpecialtySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const specialty = await prisma.specialty.create({
      data: {
        name: parsed.data.name,
      },
    });

    const finalParsed = SpecialtySchema.parse(specialty);

    return res.json({
      success: true,
      data: finalParsed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create specialty",
    });
  }
}