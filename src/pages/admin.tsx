import { Layout } from "@/components/layout";
import { 
  useGetStats, 
  useListCodes, 
  useListAdmins, 
  useCreateCode, 
  useDeleteCode,
  useAddAdmin,
  useRemoveAdmin,
  useListRewards,
  getGetStatsQueryKey,
  getListCodesQueryKey,
  getListAdminsQueryKey
} from "@/lib/mock-api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, ShieldCheck, Ticket, Users, Activity, LogOut, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useState } from "react";
import { REWARD_BG_COLORS } from "@/lib/reward-images";
// REWARD_IMAGES replaced by RewardIcon component
import { RewardIcon } from "@/components/reward-icon";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

const codeFormSchema = z.object({
  code: z.string().min(1, "Code required"),
  categoryId: z.coerce.number().min(1, "Category required"),
});

const adminFormSchema = z.object({
  discordId: z.string().min(1, "Discord ID required"),
  username: z.string().optional(),
});

function AdminLogin({ onLogin }: { onLogin: (email: string, pass: string) => boolean }) {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    const ok = onLogin(values.email, values.password);
    if (!ok) {
      setError("Invalid email or password.");
      toast({ title: "Access denied", description: "Invalid credentials.", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl p-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            <div className="flex flex-col items-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_20px_-5px_rgba(88,101,242,0.5)]">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Admin Access</h1>
              <p className="text-muted-foreground text-sm mt-1">Enter your credentials to continue</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            data-testid="input-admin-email"
                            placeholder="admin@example.com"
                            className="bg-background/50 pl-10"
                            type="email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            data-testid="input-admin-password"
                            placeholder="••••••••"
                            className="bg-background/50 pl-10 pr-10"
                            type={showPass ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <p className="text-destructive text-sm text-center">{error}</p>
                )}
                <Button
                  data-testid="button-admin-login"
                  type="submit"
                  className="w-full h-11 shadow-[0_0_20px_-5px_rgba(88,101,242,0.5)]"
                  disabled={form.formState.isSubmitting}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Login to Admin Panel
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, checked, login, logout } = useAdminAuth();
  
  const { data: stats, isLoading: statsLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: codes, isLoading: codesLoading } = useListCodes();
  const { data: admins, isLoading: adminsLoading } = useListAdmins();
  const { data: rewards } = useListRewards();

  const createCode = useCreateCode();
  const deleteCode = useDeleteCode();
  const addAdmin = useAddAdmin();
  const removeAdmin = useRemoveAdmin();

  const codeForm = useForm<z.infer<typeof codeFormSchema>>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: { code: "", categoryId: 0 }
  });

  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: { discordId: "", username: "" }
  });

  if (!checked) return null;
  if (!isAuthenticated) return <AdminLogin onLogin={login} />;

  const selectedCategoryId = codeForm.watch("categoryId");
  const selectedCategory = rewards?.find(r => r.id === Number(selectedCategoryId));

  const onCodeSubmit = (values: z.infer<typeof codeFormSchema>) => {
    createCode.mutate({ data: values }, {
      onSuccess: (created) => {
        const catName = rewards?.find(r => r.id === values.categoryId)?.name ?? "Unknown";
        toast({ title: `Code added for: ${catName}`, description: `"${created.code}" is now available.` });
        codeForm.reset();
        queryClient.invalidateQueries({ queryKey: getListCodesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      },
      onError: (err: any) => toast({ title: "Failed to create code", description: err.message, variant: "destructive" })
    });
  };

  const onAdminSubmit = (values: z.infer<typeof adminFormSchema>) => {
    addAdmin.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Admin added successfully" });
        adminForm.reset();
        queryClient.invalidateQueries({ queryKey: getListAdminsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      },
      onError: (err: any) => toast({ title: "Failed to add admin", description: err.message, variant: "destructive" })
    });
  };

  const handleDeleteCode = (id: number) => {
    if (confirm("Delete this code?")) {
      deleteCode.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Code deleted" });
          queryClient.invalidateQueries({ queryKey: getListCodesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        }
      });
    }
  };

  const handleRemoveAdmin = (discordId: string) => {
    if (confirm("Remove this admin?")) {
      removeAdmin.mutate({ discordId }, {
        onSuccess: () => {
          toast({ title: "Admin removed" });
          queryClient.invalidateQueries({ queryKey: getListAdminsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        }
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage codes, rewards, and bot access.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              <ShieldCheck className="w-4 h-4 mr-2" /> Authorized
            </Badge>
            <Button variant="ghost" size="sm" onClick={logout} data-testid="button-admin-logout">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-card/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? "-" : stats?.totalCodes}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Claimed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? "-" : stats?.claimedCodes}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{statsLoading ? "-" : stats?.availableCodes}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? "-" : stats?.totalAdmins}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="codes" className="space-y-6">
          <TabsList className="bg-card border border-white/5">
            <TabsTrigger value="codes">Codes Management</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="codes" className="space-y-6">
            <Card className="border-white/5 bg-card/50">
              <CardHeader>
                <CardTitle>Add New Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...codeForm}>
                  <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                    <div className="flex items-end gap-4">
                      <FormField
                        control={codeForm.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Reward Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                              <FormControl>
                                <SelectTrigger className="bg-background" data-testid="select-category">
                                  <SelectValue placeholder="Select reward type..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {rewards?.map(r => (
                                  <SelectItem key={r.id} value={String(r.id)}>
                                    {r.emoji} {r.name} — {r.invitesRequired} invites
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={codeForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Code Value</FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-code"
                                placeholder="e.g. NITRO-XXXX-YYYY"
                                className="bg-background font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        data-testid="button-add-code"
                        type="submit"
                        disabled={createCode.isPending}
                        className="shrink-0"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Code
                      </Button>
                    </div>

                    {selectedCategory && (
                      <div className={`flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-gradient-to-r ${REWARD_BG_COLORS[selectedCategory.name] ?? "from-primary/10 to-primary/5"}`}>
                        <div className="h-8 w-8 flex items-center justify-center">
                          <RewardIcon name={selectedCategory.name} size={28} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{selectedCategory.emoji} {selectedCategory.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedCategory.invitesRequired} invites required</p>
                        </div>
                        <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">Selected</Badge>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-card/50 overflow-hidden">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-base">All Codes</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader className="bg-card">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Claimed By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes?.map((code) => (
                    <TableRow key={code.id} className="border-white/5" data-testid={`row-code-${code.id}`}>
                      <TableCell className="font-mono text-sm">{code.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <RewardIcon name={code.categoryName} size={20} />
                          <span className="text-sm font-medium">{code.categoryName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {code.claimed ? (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">Claimed</Badge>
                        ) : (
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border border-primary/30">Available</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {code.claimedBy ? <span className="text-foreground/70">@{code.claimedBy}</span> : <span className="text-muted-foreground/50">—</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(code.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          data-testid={`button-delete-code-${code.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCode(code.id)}
                          disabled={deleteCode.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!codes || codes.length === 0) && !codesLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No codes added yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <Card className="border-white/5 bg-card/50">
              <CardHeader>
                <CardTitle>Add Bot Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="flex items-end gap-4">
                    <FormField
                      control={adminForm.control}
                      name="discordId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Discord User ID</FormLabel>
                          <FormControl>
                            <Input data-testid="input-discord-id" placeholder="1234567890" className="bg-background font-mono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Username (Optional)</FormLabel>
                          <FormControl>
                            <Input data-testid="input-username" placeholder="username" className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button data-testid="button-add-admin" type="submit" disabled={addAdmin.isPending}>
                      <Plus className="w-4 h-4 mr-2" /> Add Admin
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-card/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-card">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Discord ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins?.map((admin) => (
                    <TableRow key={admin.id} className="border-white/5" data-testid={`row-admin-${admin.id}`}>
                      <TableCell className="font-mono text-sm">{admin.discordId}</TableCell>
                      <TableCell>{admin.username || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(admin.addedAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          data-testid={`button-remove-admin-${admin.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAdmin(admin.discordId)}
                          disabled={removeAdmin.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!admins || admins.length === 0) && !adminsLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No admins added yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
