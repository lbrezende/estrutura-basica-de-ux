import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleQuestionMark,
  Clock,
  Copy,
  Database,
  ExternalLink,
  Kanban,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Palette,
  Phone,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
  TriangleAlert,
  User,
  Users,
  Wallet,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"

/**
 * O único ponto do app que traduz "nome de ícone" em componente.
 *
 * O `site.ts` guarda apenas a string (`icone: "users"`). Assim a copy não
 * precisa importar nada e trocar o ícone de um item de menu é editar uma
 * palavra. Ícone novo? Importe do lucide e acrescente uma linha aqui.
 */
const ICONES = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  kanban: Kanban,
  calendar: Calendar,
  settings: Settings,
  menu: Menu,
  fechar: X,
  sair: LogOut,
  mais: Plus,
  anterior: ChevronLeft,
  proximo: ChevronRight,
  ajuda: CircleQuestionMark,
  relogio: Clock,
  local: MapPin,
  usuario: User,
  email: Mail,
  telefone: Phone,
  empresa: Building2,
  remover: Trash2,
  check: Check,
  "seta-direita": ArrowRight,
  "seta-esquerda": ArrowLeft,
  mover: ArrowRightLeft,
  "link-externo": ExternalLink,
  copiar: Copy,
  alerta: TriangleAlert,
  paleta: Palette,
  dados: Database,
  restaurar: RotateCcw,
  dinheiro: Wallet,
} satisfies Record<string, LucideIcon>

export type NomeIcone = keyof typeof ICONES

type PropsIcone = LucideProps & {
  /** Chave do mapa acima. Nome desconhecido cai num círculo neutro em vez de sumir. */
  nome: string
}

export function Icone({ nome, strokeWidth = 1.75, ...resto }: PropsIcone) {
  const Glifo: LucideIcon = ICONES[nome as NomeIcone] ?? Circle

  // Decorativo por padrão: todo lugar que usa ícone aqui já tem rótulo em texto
  // ou `aria-label` no botão. Passe `aria-hidden={false}` se precisar do contrário.
  return <Glifo aria-hidden="true" strokeWidth={strokeWidth} {...resto} />
}
