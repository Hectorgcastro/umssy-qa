import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./sidebar"
import { TooltipProvider } from "./tooltip"

function stubViewport(isMobile: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: isMobile,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  )
}

function FullSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar {...props}>
          <SidebarHeader>
            <SidebarInput placeholder="Buscar" />
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Grupo</SidebarGroupLabel>
              <SidebarGroupAction title="Agregar">+</SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Inicio">
                      Inicio
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover>...</SidebarMenuAction>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{ children: "Perfil" }}>
                      Perfil
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/perfil" isActive>
                          Datos
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Pie</SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

describe("Sidebar (shadcn)", () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it("renders every building block on desktop", () => {
    stubViewport(false)
    render(<FullSidebar variant="floating" collapsible="icon" />)

    expect(screen.getByPlaceholderText("Buscar")).toBeInTheDocument()
    expect(screen.getByText("Grupo")).toBeInTheDocument()
    expect(screen.getByText("Inicio")).toBeInTheDocument()
    expect(screen.getByText("Datos")).toBeInTheDocument()
    expect(screen.getByText("Pie")).toBeInTheDocument()
    expect(
      document.querySelector('[data-sidebar="menu-skeleton-icon"]')
    ).not.toBeNull()
  })

  it("toggles with the trigger, the rail and the keyboard shortcut", () => {
    stubViewport(false)
    render(<FullSidebar />)
    const sidebar = document.querySelector('[data-slot="sidebar"]')
    expect(sidebar).toHaveAttribute("data-state", "expanded")

    fireEvent.click(
      document.querySelector('[data-slot="sidebar-trigger"]') as HTMLElement
    )
    expect(sidebar).toHaveAttribute("data-state", "collapsed")

    fireEvent.click(
      document.querySelector('[data-slot="sidebar-rail"]') as HTMLElement
    )
    expect(sidebar).toHaveAttribute("data-state", "expanded")

    act(() => {
      fireEvent.keyDown(window, { key: "b", ctrlKey: true })
    })
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
  })

  it("renders a static sidebar when it is not collapsible", () => {
    stubViewport(false)
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">Fijo</Sidebar>
      </SidebarProvider>
    )
    expect(screen.getByText("Fijo")).toBeInTheDocument()
  })

  it("supports a controlled open state", () => {
    stubViewport(false)
    const onOpenChange = vi.fn()
    render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <SidebarTrigger />
      </SidebarProvider>
    )
    fireEvent.click(
      document.querySelector('[data-slot="sidebar-trigger"]') as HTMLElement
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("opens the mobile sheet with the trigger", async () => {
    stubViewport(true)
    render(<FullSidebar side="right" />)

    fireEvent.click(
      document.querySelector('[data-slot="sidebar-trigger"]') as HTMLElement
    )
    expect(await screen.findByText("Inicio")).toBeInTheDocument()
    expect(document.querySelector('[data-mobile="true"]')).not.toBeNull()
  })

  it("throws when useSidebar is used outside the provider", () => {
    function Orphan() {
      useSidebar()
      return null
    }
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<Orphan />)).toThrow()
  })
})
