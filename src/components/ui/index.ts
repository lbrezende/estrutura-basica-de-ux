/**
 * Porta de entrada dos primitivos.
 *
 * Importe sempre daqui, com `import { Button, Card } from "@/components/ui"`,
 * pra que uma mudança de arquivo não quebre as telas.
 *
 * `dialogo.tsx` e parte de `campo.tsx` ficam de fora de propósito: são a
 * infraestrutura que modal, drawer e os campos compartilham, não peças de tela.
 */

export { Button, type ButtonProps, type TamanhoBotao, type VarianteBotao } from "./button"

export {
  Card,
  CardCabecalho,
  CardConteudo,
  CardDescricao,
  CardRodape,
  CardTitulo,
  type CardProps,
  type CardRodapeProps,
  type CardTituloProps,
} from "./card"

export { Input, type InputProps } from "./input"
export { Textarea, type TextareaProps } from "./textarea"
export { Select, type OpcaoSelect, type SelectProps } from "./select"
export { type PropsCompartilhadasDeCampo } from "./campo"

export { Badge, type BadgeProps, type VarianteBadge } from "./badge"

export { Modal, type ModalProps, type TamanhoModal } from "./modal"
export { Drawer, type DrawerProps, type LarguraDrawer } from "./drawer"
export { Confirmar, type ConfirmarProps } from "./confirmar"

export { EstadoVazio, type EstadoVazioProps } from "./estado-vazio"
export { CampoBusca, type CampoBuscaProps } from "./campo-busca"
