export const WorkspaceAvatar = ({
    color,
    name,
}:{
    color: string;
    name: string;
}) =>{
    return (
        <div className="w-6 h-6 rounded flex item-center justify-center" style = {{backgroundColor: color}}>
            <span className="font-medium text-xs">{name.charAt(0).toUpperCase()}</span>

        </div>
    )
}