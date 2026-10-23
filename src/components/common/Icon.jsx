import { LayoutDashboard, User, Award, Upload, ClipboardList, FolderGit2, FileText, Users, Bell, PenLine, BarChart3, Settings, ShieldCheck, Building2, LogOut, Menu, X, Search, Heart, MessageCircle, Bookmark, Lock, Eye, EyeOff, Trash2, Plus, Check, Link2, ExternalLink, Download, Info, ArrowLeft } from 'lucide-react'
const map = { LayoutDashboard, User, Award, Upload, ClipboardList, FolderGit2, FileText, Users, Bell, PenLine, BarChart3, Settings, ShieldCheck, Building2, LogOut, Menu, X, Search, Heart, MessageCircle, Bookmark, Lock, Eye, EyeOff, Trash2, Plus, Check, Link2, ExternalLink, Download, Info, ArrowLeft }
export default function Icon({ name, size = 18, className = '' }) {
  const C = map[name] || Info
  return <C size={size} className={className} />
}
