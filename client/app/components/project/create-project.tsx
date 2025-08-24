import { projectSchema } from "@/lib/schema";
import { ProjectStatus, type MemberProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "../ui/dialog";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { UseCreateProject } from "@/hooks/use-project";
import { toast } from "sonner";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceMembers: MemberProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CreateProjectDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}: CreateProjectDialogProps) => {
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.PLANNING,
      startDate: "",
      dueDate: "",
      members: [],
      tags: undefined,
    },
  });
  const { mutate, isPending } = UseCreateProject();

  const onSubmit = (values: CreateProjectFormData) => {
    if (!workspaceId) return;

    mutate(
      {
        projectData: values,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project to get started
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Project Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Project Description"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Project Status" />
                      </SelectTrigger>

                      <SelectContent>
                        {Object.values(ProjectStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full justify-start text-left font-normal" +
                              (!field.value ? "text-muted-foreground" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              format(new Date(field.value), "PPPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date?.toISOString() || undefined);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full justify-start text-left font-normal" +
                              (!field.value ? "text-muted-foreground" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              format(new Date(field.value), "PPPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date?.toISOString() || undefined);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tags separated by comma" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="members"
              render={({ field }) => {
                const selectedMembers = field.value || [];

                return (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal min-h-11"
                          >
                            {selectedMembers.length === 0 ? (
                              <span className="text-muted-foreground">
                                Select Members
                              </span>
                            ) : selectedMembers.length <= 2 ? (
                              selectedMembers.map((m, index) => {
                                const member = workspaceMembers.find(
                                  (wm) => String(wm.user._id) === String(m.user)
                                );
                                return (
                                  <span key={index}>
                                    {member?.user.name} ({m.role})
                                    {index < selectedMembers.length - 1 && ", "}
                                  </span>
                                );
                              })
                            ) : (
                              `${selectedMembers.length} members selected`
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full max-w-60 overflow-y-auto"
                          align="start"
                        >
                          <div className="flex flex-col gap-2">
                            {workspaceMembers.map((member) => {
                              const isSelected = selectedMembers.some(
                                (m) => String(m.user) === String(member.user._id)
                              );
                              const selectedMember = selectedMembers.find(
                                (m) => String(m.user) === String(member.user._id)
                              );

                              return (
                                <div
                                  key={member._id}
                                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                                >
                                  
                                  <div 
                                    className="flex items-center gap-2 flex-1 cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      console.log(`${member.user.name} clicked, currently selected:`, isSelected);

                                      let newMembers;
                                      if (!isSelected) {
                                        // Add member
                                        newMembers = [
                                          ...selectedMembers,
                                          {
                                            user: String(member.user._id),
                                            role: "contributor",
                                          },
                                        ];
                                        console.log(`Adding ${member.user.name}`);
                                      } else {
                                        // Remove member
                                        newMembers = selectedMembers.filter(
                                          (m) => String(m.user) !== String(member.user._id)
                                        );
                                        console.log(`Removing ${member.user.name}`);
                                      }

                                      console.log("New members array:", newMembers);
                                      field.onChange(newMembers);
                                    }}
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => {}} 
                                      id={`member-${member.user._id}`}
                                    />
                                    <label 
                                      htmlFor={`member-${member.user._id}`}
                                      className="truncate flex-1 cursor-pointer"
                                    >
                                      {member.user.name}
                                    </label>
                                  </div>

                                 
                                  {isSelected && selectedMember && (
                                    <Select
                                      value={selectedMember.role}
                                      onValueChange={(role) => {
                                        console.log(`Changing ${member.user.name} role to:`, role);
                                        const newMembers = selectedMembers.map((m) =>
                                          String(m.user) === String(member.user._id)
                                            ? { 
                                                ...m, 
                                                role: role as "contributor" | "manager" | "viewer" 
                                              }
                                            : m
                                        );
                                        field.onChange(newMembers);
                                      }}
                                    >
                                      <SelectTrigger className="w-24 h-8 text-xs">
                                        <SelectValue placeholder="Role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="contributor">Contributor</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />


            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
