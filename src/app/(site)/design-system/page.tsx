import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Design System | AlgoNotes",
};

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <div className="mb-16">
        <h1 className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
          Design System
        </h1>
        <p className="mt-4 text-text-muted">
          Futuristic components for the ultimate learning platform.
        </p>
      </div>

      <div className="space-y-16">
        {/* Buttons Section */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Buttons</h2>
          <div className="flex flex-wrap gap-6 rounded-3xl border border-[#1F2228] bg-surface/30 p-8 backdrop-blur-xl">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-text-muted">Default</span>
              <Button>Primary Action</Button>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-text-muted">Secondary</span>
              <Button variant="secondary">Secondary Action</Button>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-text-muted">Outline</span>
              <Button variant="outline">Outline Action</Button>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-text-muted">Ghost</span>
              <Button variant="ghost">Ghost Action</Button>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Cards</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Binary Search</CardTitle>
                <CardDescription>O(log n) time complexity.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">
                  Search a sorted array by repeatedly dividing the search interval in half.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Explore Concept
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dynamic Programming</CardTitle>
                <CardDescription>Optimization over plain recursion.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">
                  Solve complex problems by breaking them down into simpler subproblems.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Explore Concept
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
