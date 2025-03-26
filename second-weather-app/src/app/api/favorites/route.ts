import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Favorite } from '@/lib/db/models/Favorite';
import { auth } from '@/auth'

export interface FavoriteCity {
  id: string;
  name: string;
  addedAt: string;
  lastChecked?: string;
  notes?: string;
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    
    if (city) {
      const favorite = await Favorite.findOne({ 
        name: city,
        ...(country && { country }),
        userId: session.user.id,
      });
      
      return NextResponse.json({
        isFavorite: !!favorite,
        favoriteId: favorite?._id || null
      });
    }
    
    const favorites = await Favorite.find({ userId: session.user.id });
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.email) {
      console.log("Authentication required - no valid session")
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    console.log("received favorite POST request:", body)
    console.log("Current user:", session.user)
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }
    
    if (!body.country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }
    
    const favorite = await Favorite.create({
      name: body.name,
      country: body.country,
      userId: session.user.id,
    });
    console.log("Created favorite:", favorite)
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/favoritesf:", error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'City is already in favorites' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { id, ...updates } = body;

    const favorite = await Favorite.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...updates, lastChecked: new Date() },
      { new: true, runValidators: true }
    );

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(favorite);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const favorite = await Favorite.findOneAndDelete({
      _id: id,
      userId: session.user.id
    });
    
    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete favorite' },
      { status: 500 }
    );
  }
}