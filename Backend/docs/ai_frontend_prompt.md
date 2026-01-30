# Prompt para IA — Gerar Front-end para Sistema de Reserva de Cinema

Objetivo: gerar um front-end completo (React + TypeScript) para o backend existente neste repositório (Sistema de Reserva de Cinema). O front deve ser responsivo, acessível e conter telas de usuário e administração para cadastro, navegação por filmes, visualização de sessões, seleção de assentos e reserva.

---

## Informações do backend (resumo técnico)

Banco: PostgreSQL via Prisma.

Modelos principais (campos essenciais):

- Role: `id`, `role`
- User: `id`, `name`, `email`, `password`, `roleId`, `isActive`, `createdAt`, `updatedAt`
- Client: `id`, `userId`, `phone`, `dateOfBirth`, `preferredGenres[]`, `createdAt`
- Movie: `id`, `title`, `description`, `coverImageUrl`, `createdAt`, `updatedAt`
- Category: `id`, `name`, `createdAt`, `updatedAt`
- MovieCategorie: `id`, `movieId`, `categoryId`
- Room: `id`, `number`, `capacity`, `createdAt`, `updatedAt`
- Seat: `id`, `roomId`, `numberSeat`, `createdAt`, `updatedAt`
- Session: `id`, `movieId`, `roomId`, `data` (DateTime), `createdAt`, `updatedAt`
- Reservation: `id`, `sessionId`, `userId`, `status` (PENDING|CONFIRMED|CANCELLED`), `createdAt`, `updatedAt`
- ReservationSeat: `id`, `seatId`, `reservationId`

Endpoints esperados (nomes/paths sugeridos):
- `POST /auth/login` — login (recebe email, password) => retorna token
- `POST /auth/register` — registro de usuário/cliente
- `GET /movies` — lista de filmes (suportar query params: search, category, page, perPage)
- `GET /movies/:id` — detalhes do filme (inclui sessions)
- `GET /sessions` — listar sessões (filter por movieId, date)
- `GET /rooms/:id/seats` — obter assentos da sala
- `POST /reservations` — criar reserva (sessionId, userId, seats[])
- `GET /clients/me` — perfil do cliente (autenticado)
- `GET /categories` — listar categorias
- Admin: CRUD para movies, sessions, rooms, categories, users, reservations
- Upload de imagens: `POST /upload` (para `coverImageUrl`)

(Se os nomes dos endpoints diferirem, a IA deve tornar as rotas fáceis de ajustar via um arquivo `apiConfig.ts`.)

---

## Requisitos do Front-end (entregáveis desejados)

Tecnologias recomendadas (especificar no prompt):
- React + TypeScript
- Bundler: Vite
- UI: componente próprio ou biblioteca como Chakra UI / Material UI (escolha uma)
- HTTP: `axios`
- State & Data Fetching: `React Query` (tanstack/react-query)
- Formulários: `react-hook-form` + validação com `zod`
- Autenticação: JWT via `Authorization: Bearer <token>` em `localStorage` ou `httpOnly cookie` (preferência: token no armazenamento gerenciado por `auth` context)
- Testes básicos: `Vitest` + `React Testing Library` (opcional)

Padrões de projeto e arquitetura:
- Pages / Routes: `Home`, `Movies`, `MovieDetail`, `Booking`, `Checkout`, `Profile`, `Admin/*`
- Componentes reutilizáveis: `Header`, `Footer`, `MovieCard`, `SessionList`, `SeatMap`, `ProtectedRoute`, `AdminTable`, `Modal`.
- Organização de pastas: `src/components`, `src/pages`, `src/services/api`, `src/hooks`, `src/styles`, `src/types`.
- Theme: esquema claro/escuro com tokens (cores, espaçamentos, tipografia).
- Responsividade: mobile-first; cores e contrastes acessíveis.
- Internacionalização (i18n): preparar strings isoladas (opcional).

UX e fluxos principais:
1. Home / Catálogo: carrossel ou grid de `MovieCard` com busca e filtros por categoria.
2. Página do filme: capa, descrição, categorias, sessões disponíveis (datas/hora), botão para ver horários.
3. Seleção de sessão: escolher data/hora -> ver mapa de assentos da `Room` com assentos livres/ocupados; selecionar assentos.
4. Checkout/Reserva: revisar assentos, preencher dados do cliente (se não autenticado: login/register), confirmar pagamento simulado e criar reserva.
5. Perfil do cliente: ver reservas ativas, histórico, editar dados (phone, preferredGenres).
6. Admin: dashboard com CRUD para filmes (upload de imagem), sessões (escolher sala e data/hora), salas (número, capacidade), categorias, e visão de reservas.

Acessibilidade e qualidade:
- Navegação por teclado para mapa de assentos e formulários.
- Labels claros, foco visível, roles ARIA para controles complexos.
- Mensagens de erro amigáveis e validação front-end.

---

## Layouts e componentes detalhados (instruções para a IA gerar código)

- `Header`: logo, navegação (Home, Filmes, Minhas Reservas), botão de login/usuario. Componente responsivo que vira um drawer no mobile.
- `MovieCard`: imagem (coverImageUrl), título, categorias, botão `Ver horários`.
- `MovieDetail`: header com imagem banner, descrição, rating (opcional), lista de sessões agrupadas por dia.
- `SessionList`: lista de sessões por sala/data com botão `Selecionar assentos`.
- `SeatMap`: grade com assentos numerados; estados: livre (verde), ocupado (cinza), selecionado (azul). Deve suportar seleção múltipla e retornar ids de assento.
- `BookingForm`: resumo da sessão, assentos, total, botão confirmar; requer autenticação.
- `AdminTable`: lista paginada com ações (Criar, Editar, Deletar) e modais de formulário.

Estilos: fornecer arquivos CSS-in-JS (styled-components / emotion) ou CSS modules. Incluir tokens no `theme.ts`.

---

## Exemplos de chamadas API (incluir no prompt para a IA gerar serviços)

- Listar filmes:
```
GET /movies?page=1&perPage=12&category=acao&search=matrix
```
- Detalhes do filme:
```
GET /movies/:id
```
- Listar sessões por filme:
```
GET /sessions?movieId=:id
```
- Obter assentos da sala:
```
GET /rooms/:roomId/seats
```
- Criar reserva:
```
POST /reservations
Body: { sessionId: string, userId: string, seatIds: string[] }
```
- Upload de imagem:
```
POST /upload (form-data file)
Response: { url: string }
```

Peça para a IA criar um `apiClient` centralizado para configurar `axios` com baseURL e interceptors para anexar token.

---

## Entregáveis e expectativa de estrutura final

- Projeto React + TypeScript pronto para rodar com `npm install` e `npm run dev`.
- Rotas implementadas e integração com o backend via serviços (`src/services/*`).
- Componentes reutilizáveis e documentação mínima (README com como rodar e onde configurar a `API_BASE_URL`).
- Mock de autenticação e telas de cadastro/login, com proteção de rotas.
- Scripts de build e instruções para deploy estático.

---

## Instruções adicionais para a IA (tom e formato)

- Gere código limpo e modular, com comentários mínimos explicativos.
- Use TypeScript estrito e tipos para modelos baseados no schema Prisma fornecido.
- Priorize resultados funcionais: se algo não puder ser totalmente implementado (ex.: integração real de pagamento), forneça stubs e instruções claras para completar.
- Inclua exemplos de testes unitários básicos nas partes críticas (SeatMap, BookingForm).

---

## Observações finais para a IA

- Repare no `prisma/schema.prisma` (models listados acima) ao gerar tipos e formulários.
- Crie um arquivo `src/config/apiConfig.ts` para fácil ajuste das rotas do backend.
- Forneça componentes que facilitem o consumo pelo backend existente (campos com os mesmos nomes: `sessionId`, `seatId`, `movieId`, etc.).

---

Por favor, gere o front-end completo seguindo estas instruções e coloque o projeto gerado dentro de uma pasta `frontend/` com README e comandos para rodar. Se precisar de decisões adicionais (biblioteca UI, método de autenticação persistente), escolha soluções modernas e explique rapidamente no README.
