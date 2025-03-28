import { NextResponse } from 'next/server';
import { auth } from '@/auth';


// API endpoint to test authentication status
// Returns user information if authenticated

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }
  
  const session = await auth();
  
  if(session?.user) {
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }
    })
  }
  
  return NextResponse.json({
    authenticated: false
  })
}