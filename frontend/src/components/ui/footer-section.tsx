"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Send, Twitter, Activity } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"
import { Logo } from "@/components/ui/Logo"

function Footerdemo() {
  const { t } = useLanguage()

  return (
    <footer className="relative border-t bg-black text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <Logo size="md" />
            </div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">{t('foot_stay_healthy')}</h2>
            <p className="mb-6 text-zinc-400 text-sm">
              {t('foot_desc')}
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-white/20"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg bg-white text-black transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl -z-10" />
          </div>
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/40">{t('foot_platform')}</h3>
            <nav className="space-y-4 text-sm font-medium">
              <Link to="/#about" className="block text-zinc-400 transition-colors hover:text-white">
                {t('nav_about')}
              </Link>
              <Link to="/#features" className="block text-zinc-400 transition-colors hover:text-white">
                {t('foot_core_feat')}
              </Link>
              <Link to="/#pricing" className="block text-zinc-400 transition-colors hover:text-white">
                {t('nav_pricing')}
              </Link>
              <Link to="/#faqs" className="block text-zinc-400 transition-colors hover:text-white">
                {t('nav_faq')}
              </Link>
              <Link to="/#contact" className="block text-zinc-400 transition-colors hover:text-white">
                {t('foot_contact_us')}
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/40">Headquarters</h3>
            <address className="space-y-4 text-sm not-italic text-zinc-400">
              <p className="flex items-center gap-2">
                123 Health Innovation Way
              </p>
              <p>Medical District, SF 94103</p>
              <p className="pt-2">Phone: +1 (555) BIO-VITA</p>
              <p>Email: support@biovita.io</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/40">Connect</h3>
            <div className="mb-8 flex space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-white/10 text-white">
                    <p>Follow our health community</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-white/10 text-white">
                    <p>Latest medical news</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-white/10 text-white">
                    <p>Wellness visual guides</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-white/10 text-white">
                    <p>Professional network</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 text-center md:flex-row">
          <p className="text-xs font-medium text-zinc-500">
            © 2024 BioVita Health Systems. {t('foot_rights')}
          </p>
          <nav className="flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-white">
              HIPAA Compliance
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }
