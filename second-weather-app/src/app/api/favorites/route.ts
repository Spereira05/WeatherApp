import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Favorite } from '@/lib/db/models/Favorite';

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
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    
    if (city) {
          const favorite = await Favorite.findOne({ 
            name: city,
            ...(country && { country })
          });
          
          return NextResponse.json({
            isFavorite: !!favorite,
            favoriteId: favorite?._id || null
          });
        }
        
    const favorites = await Favorite.find({});
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
    const body = await request.json();
    
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
    
    const favorite = await Favorite.create ({
      name: body.name,
      country: body.country,
    });
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
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
    const body = await request.json();
    const { id, ...updates } = body;

    const favorite = await Favorite.findByIdAndUpdate(
      id,
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const favorite = await Favorite.findByIdAndDelete(id)
    
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