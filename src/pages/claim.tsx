import { Layout } from "@/components/layout";
import { useClaimCode } from "@/lib/mock-api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
type Code = { categoryName: string; code: string };

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  discordId: z.string().optional(),
});

export default function Claim() {
  const { toast } = useToast();
  const claimMutation = useClaimCode();
  const [claimedReward, setClaimedReward] = useState<Code | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discordId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setClaimedReward(null);
    claimMutation.mutate({
      data: {
        code: values.code,
        discordId: values.discordId || undefined,
      }
    }, {
      onSuccess: (data) => {
        setClaimedReward(data);
        form.reset();
        toast({
          title: "Code Claimed Successfully!",
          description: `You have successfully redeemed a code for: ${data.categoryName}`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Claim Failed",
          description: error?.message || "Invalid or already claimed code.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Ticket className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Redeem Your Code</h1>
          <p className="text-muted-foreground text-lg">Enter your unique reward code below to claim your prize.</p>
        </div>

        <Card className="border-white/10 bg-card/50 backdrop-blur shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
          <CardHeader>
            <CardTitle>Code Redemption</CardTitle>
            <CardDescription>Make sure you have your Discord ID handy if required.</CardDescription>
          </CardHeader>
          <CardContent>
            {claimedReward ? (
              <div className="p-8 text-center space-y-4 rounded-xl bg-primary/5 border border-primary/20">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                <h3 className="text-2xl font-bold text-white">Reward Claimed!</h3>
                <p className="text-muted-foreground">
                  You successfully claimed <span className="text-primary font-semibold">{claimedReward.categoryName}</span>.
                </p>
                <Button className="mt-4" onClick={() => setClaimedReward(null)} variant="outline">
                  Claim Another Code
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="XXXX-XXXX-XXXX" 
                            className="bg-background/50 border-white/10 h-14 text-lg font-mono tracking-widest uppercase placeholder:text-muted-foreground/30 focus-visible:ring-primary/50" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discordId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord User ID (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 123456789012345678" 
                            className="bg-background/50 border-white/10" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-medium shadow-[0_0_20px_-5px_rgba(88,101,242,0.5)] transition-all hover:shadow-[0_0_30px_-5px_rgba(88,101,242,0.7)]" 
                    disabled={claimMutation.isPending}
                  >
                    {claimMutation.isPending ? "Verifying..." : "Claim Reward"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
