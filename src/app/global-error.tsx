'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real application, you would log the error to a reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive">Oops! Something went wrong.</CardTitle>
                    <CardDescription>
                        We encountered an unexpected error. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">If the problem persists, please contact support.</p>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-xs">Error Details</summary>
                            <pre className="mt-2 text-xs text-destructive bg-muted p-2 rounded-md overflow-auto">
                                {error?.stack || error?.message}
                            </pre>
                        </details>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={() => reset()} className="w-full">
                        Try Again
                    </Button>
                </CardFooter>
            </Card>
        </main>
      </body>
    </html>
  );
}
