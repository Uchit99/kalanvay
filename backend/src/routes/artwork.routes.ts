import express from "express";
import { z } from "zod";

import prisma from "../lib/prisma";

const router = express.Router();

/* =========================================================
   VALIDATION
========================================================= */

const artworkSchema = z.object({
  title: z.string().trim().min(2).max(200),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(220)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens."
    ),

  medium: z.string().trim().min(2).max(200),

  size: z.string().trim().min(1).max(100),

  description: z.string().trim().min(10).max(5000),

  price: z.coerce.number().positive(),

  type: z.enum(["ORIGINAL", "LIMITED_EDITION"]),

  category: z.string().trim().min(2).max(100),

  stock: z.coerce.number().int().min(0),

  isPublished: z.boolean().optional().default(false),

  isFeatured: z.boolean().optional().default(false),

  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().trim().max(255).optional(),
      })
    )
    .optional()
    .default([]),
});

/* =========================================================
   PUBLIC — GET ALL PUBLISHED ARTWORKS
========================================================= */

router.get("/", async (_req, res, next) => {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        isPublished: true,
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },

      orderBy: [
        {
          isFeatured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return res.json({
      success: true,
      artworks,
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   PUBLIC — GET FEATURED ARTWORKS
========================================================= */

router.get("/featured", async (_req, res, next) => {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      artworks,
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   PUBLIC — GET SINGLE ARTWORK
========================================================= */

router.get("/:slug", async (req, res, next) => {
  try {
    const artwork = await prisma.artwork.findFirst({
      where: {
        slug: req.params.slug,
        isPublished: true,
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },

        reviews: {
          where: {
            isApproved: true,
          },

          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found.",
      });
    }

    return res.json({
      success: true,
      artwork,
    });
  } catch (error) {
    next(error);
  }
});

export default router;