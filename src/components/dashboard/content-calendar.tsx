
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export function ContentCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        {isClient ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        ) : (
          <div className="h-[298px] w-[280px] rounded-md border" /> 
        )}
      </CardContent>
    </Card>
  );
}
