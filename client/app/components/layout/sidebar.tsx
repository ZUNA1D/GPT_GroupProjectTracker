import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { CheckCircle2, ChevronLeft, ChevronRight, LayoutDashboard, ListCheck, LogOut, Settings, User, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
    currentWorkspace,
    }: {
        currentWorkspace: Workspace | null;}) =>{

    const {user, logout} = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navitems = [
        {
            title:"Dashboard",
            href:"/dashboard",
            icon: LayoutDashboard,
        },
        {
            title:"Workspaces",
            href:"/workspaces",
            icon: Users,
        },
        {
            title:"My Tasks",
            href:"/my-tasks",
            icon: ListCheck,
        },
        {
            title:"Members",
            href:"/members",
            icon: Users,
        },
        {
            title:"Achieved",
            href:"/achieved",
            icon: CheckCircle2,
        },
        {
            title:"Settings",
            href:"/settings",
            icon: Settings,
        },
    ];
    return(
    <div className={cn("flex flex-col bg-sidebar border-r transition-all duration-300", 
        isCollapsed ? "w-16 md:w[80px]" : "w-16 md:w-[240px]")}>

        <div className="flex items-center h-14 border-b mb-4 px-4">
            <Link to="/dashboard" className="flex items-center">
                {!isCollapsed && (<div className="flex items-center gap-2">
                    <span className="font-semibold text-lg hidden md:block">GroupProjectTracker</span>
                    </div>
                )}

                {isCollapsed && (
                    <div>
                        {/* <Wrench className="size-6 text-blue-600" /> */}
                        <span className="font-semibold text-lg hidden md:block">GPT</span>
                    </div>
                )}
            </Link>

            <Button variant={"ghost"} size={"icon"} className="ml-auto hidden md:block" onClick={() => setIsCollapsed(!isCollapsed)}>
                {
                    isCollapsed ? (
                        <ChevronRight className="size-4" />
                    ) : (
                        <ChevronLeft className="size-4" /> 
                    )
                }
            </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
            <SidebarNav 
                items = {navitems}
                isCollapsed = {isCollapsed}
                className ={cn(isCollapsed && "items-center space-y-2")}
                currentWorkspace = {currentWorkspace}
                
            />
        </ScrollArea>

        <div>
            <Button variant={"ghost"}  size={isCollapsed ? "icon" : "default"} onClick={logout}>
                <LogOut className={cn("size-4", isCollapsed && "mr-2")}/>
                <span className="hidden md:block">Logout</span>
            </Button>
        </div>

    </div>
    );
};