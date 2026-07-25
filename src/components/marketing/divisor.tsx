/**
 * O fio entre duas dobras.
 *
 * Uma linha de ponta a ponta corta a página em fatias e denuncia a régua: o olho
 * lê "seção, seção, seção" antes de ler o conteúdo. Este fio nasce e morre no
 * transparente, então ele separa sem cortar.
 *
 * A cor sai de `--ds-hairline` num `style`, e não de uma classe: o gradiente
 * precisa da variável do tema no meio da declaração, e escrever isso como classe
 * arbitrária do Tailwind é onde a página costuma quebrar sem avisar.
 */
export function Divisor() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full"
      style={{
        backgroundImage:
          "linear-gradient(to right, transparent 0%, var(--ds-hairline) 22%, var(--ds-hairline) 78%, transparent 100%)",
      }}
    />
  )
}
