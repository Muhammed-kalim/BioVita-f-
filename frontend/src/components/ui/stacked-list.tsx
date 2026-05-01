"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ProfileIcon,
  Search01Icon,
  Cancel01Icon,
  Add01Icon,
  Briefcase01Icon,
  PaintBoardIcon,
  Database01Icon,
  QuillWrite01Icon,
} from "@hugeicons/core-free-icons";

interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
  roleType: "doctor" | "dad" | "mom" | "sister" | "brother" | "friend";
  avatar: string;
}

const ALL_MEMBERS: Member[] = [
  {
    id: "01",
    name: "Dr. Michael Chen",
    phone: "+1 (555) 123-4567",
    role: "Doctor",
    roleType: "doctor",
    avatar: "https://tapback.co/api/avatar/Oliver.webp",
  },
  {
    id: "02",
    name: "Sarah Miller",
    phone: "+1 (555) 234-5678",
    role: "Mom",
    roleType: "mom",
    avatar: "https://tapback.co/api/avatar/Sophie.webp",
  },
  {
    id: "03",
    name: "David Miller",
    phone: "+1 (555) 345-6789",
    role: "Dad",
    roleType: "dad",
    avatar: "https://tapback.co/api/avatar/Noah.webp",
  },
  {
    id: "04",
    name: "Emily Miller",
    phone: "+1 (555) 456-7890",
    role: "Sister",
    roleType: "sister",
    avatar: "https://tapback.co/api/avatar/Emma.webp",
  },
  {
    id: "05",
    name: "James Wilson",
    phone: "+1 (555) 567-8901",
    role: "Brother",
    roleType: "brother",
    avatar: "https://tapback.co/api/avatar/Leo.webp",
  },
  {
    id: "06",
    name: "Dr. Sarah Lee",
    phone: "+1 (555) 678-9012",
    role: "Specialist",
    roleType: "doctor",
    avatar: "https://tapback.co/api/avatar/Mia.webp",
  },
  {
    id: "07",
    name: "Mark Thompson",
    phone: "+1 (555) 789-0123",
    role: "Friend",
    roleType: "friend",
    avatar: "https://tapback.co/api/avatar/Ethan.webp",
  },
];

const ACTIVE_MEMBERS = ALL_MEMBERS.slice(0, 4);

const sweepSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
  mass: 0.5,
};

const RoleBadge = ({
  type,
  label,
}: {
  type: Member["roleType"];
  label: string;
}) => {
  const styles = {
    doctor: {
      bg: "bg-[#F0F7FF]",
      text: "text-[#004085]",
      border: "border-[#B8DAFF]",
      icon: Briefcase01Icon,
    },
    dad: {
      bg: "bg-[#F3FAF4]",
      text: "text-[#155724]",
      border: "border-[#C3E6CB]",
      icon: ProfileIcon,
    },
    mom: {
      bg: "bg-[#FCF5FF]",
      text: "text-[#522785]",
      border: "border-[#E8D1FF]",
      icon: ProfileIcon,
    },
    sister: {
      bg: "bg-[#FFFCEB]",
      text: "text-[#856404]",
      border: "border-[#FFEBA5]",
      icon: ProfileIcon,
    },
    brother: {
      bg: "bg-[#FFF5F0]",
      text: "text-[#854004]",
      border: "border-[#FFDAB8]",
      icon: ProfileIcon,
    },
    friend: {
      bg: "bg-[#F0FFF4]",
      text: "text-[#006644]",
      border: "border-[#B8FFD9]",
      icon: ProfileIcon,
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border} shrink-0`}
    >
      <HugeiconsIcon icon={Icon} size={12} strokeWidth={1.8} />
      <span className="text-xs font-regular tracking-tight uppercase whitespace-nowrap truncate max-w-[60px] sm:max-w-none">
        {label}
      </span>
    </div>
  );
};

const MemberItem = ({ member }: { member: Member; key?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: 10, y: 15, rotate: 1 },
      visible: { opacity: 1, x: 0, y: 0, rotate: 0 },
    }}
    transition={sweepSpring}
    style={{ originX: 1, originY: 1 }}
    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all mb-3 last:mb-0"
  >
    <div className="flex items-center gap-4 min-w-0">
      <div className="relative shrink-0">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5 grayscale-[0.1] group-hover:grayscale-0 transition-all duration-300"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-white tracking-tight leading-none mb-1.5 truncate">
          {member.name}
        </h3>
        <p className="text-sm font-medium text-white/40 leading-none">
          {member.phone}
        </p>
      </div>
    </div>
    <div className="shrink-0 ml-4">
      <RoleBadge type={member.roleType} label={member.role} />
    </div>
  </motion.div>
);

export function StackedList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAllMembers = useMemo(
    () =>
      ALL_MEMBERS.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.role.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div className="flex items-center justify-center w-full font-sans not-prose">
      <div className="relative w-full pb-6 glass rounded-3xl flex flex-col overflow-hidden shadow-none">
        <motion.div 
          animate={{ opacity: isExpanded ? 0 : 1 }}
          className="flex flex-col h-full"
        >
          <div className="p-8 pb-3">
            <div className="relative mb-4">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 z-10"
                size={16}
              />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-11 pr-4 bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-white/10 rounded-2xl text-base text-white placeholder:text-white/20 transition-all w-full box-border"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-20 custom-scrollbar scroll-visible">
            <motion.div
              initial={false}
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
              className="space-y-0.5"
            >
              {ACTIVE_MEMBERS.map((member) => (
                <MemberItem key={`active-${member.id}`} member={member} />
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          layout
          initial={false}
          animate={{
            height: isExpanded ? "calc(100% - 20px)" : "68px",
            width: isExpanded ? "calc(100% - 20px)" : "calc(100% - 40px)",
            bottom: isExpanded ? "10px" : "20px",
            left: isExpanded ? "10px" : "20px",
            borderRadius: isExpanded ? "24px" : "20px",
            backgroundColor: isExpanded ? "#0a0a0a" : "rgba(255, 255, 255, 0.05)",
          }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 30,
            mass: 0.8,
            ease: "easeInOut",
          }}
          className="absolute z-50 overflow-hidden border border-white/10 shadow-2xl flex flex-col group/bar"
          style={{ cursor: isExpanded ? "default" : "pointer" }}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <div
            className={`flex items-center justify-between px-3 h-[68px] shrink-0 transition-colors ${
              isExpanded ? "border-b border-white/10" : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-sm transition-transform group-hover/bar:scale-105`}
              >
                <HugeiconsIcon icon={ProfileIcon} size={20} strokeWidth={2} />
              </div>
              <motion.div layout="position">
                <h4 className="text-base font-bold text-white tracking-tight leading-none">
                  Contact Directory
                </h4>
                <p className="text-xs font-medium leading-none text-white/40 mt-1">
                  {ALL_MEMBERS.length} Contacts Registered
                </p>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              {!isExpanded && (
                <div className="flex items-center gap-0">
                  <div className="flex -space-x-3">
                    {ALL_MEMBERS.slice(0, 3).map((m) => (
                      <motion.img
                        key={`sum-${m.id}`}
                        layoutId={`avatar-${m.id}`}
                        src={m.avatar}
                        className="w-10 h-10 rounded-full ring-1 ring-background shadow-sm z-1"
                        alt="avatar"
                      />
                    ))}
                    <div className="w-10 h-10 rounded-full ring-1 ring-background bg-muted flex items-center justify-center shadow-sm relative z-0">
                      <span className="text-sm font-regular leading-none text-muted-foreground">
                        +{ALL_MEMBERS.length - 3}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isExpanded && (
                <button
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground transition-all flex items-center justify-center bg-muted/60 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={18}
                    strokeWidth={2.5}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="px-6 py-4"
                >
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 z-10"
                      size={15}
                    />
                    <Input
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 transition-all w-full box-border pl-10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar scroll-visible">
              <motion.div
                initial="hidden"
                animate={isExpanded ? "visible" : "hidden"}
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
                  },
                  hidden: {
                    transition: { staggerChildren: 0.02, staggerDirection: -1 },
                  },
                }}
                className="space-y-0.5"
              >
                {filteredAllMembers.map((member) => (
                  <MemberItem key={`list-${member.id}`} member={member} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StackedList
