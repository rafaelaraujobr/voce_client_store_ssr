# Migração de Tenant: Rota → Subdomínio

## 🎯 O que foi feito

Migração simples e limpa do sistema de tenant de `/in/{slug}` para `{slug}.vocelab.com.br`.

## 📝 Mudanças Mínimas

### 1. `server/middleware/tenent.ts`
- ✅ Mantido código original
- ➕ Adicionado validação de subdomínios reservados
- ➕ Mudado domínio padrão para `vocelab.com.br`

### 2. `server/middleware/redirect-tenent.ts`  
- ✅ Mantida estrutura original
- ➕ Adicionado redirecionamento automático `/in/{slug}` → `{slug}.vocelab.com.br`

### 3. `nuxt.config.ts`
- ➕ Adicionado `baseDomain` no runtimeConfig público

### 4. `app/composables/tenentslug.composable.ts`
- ✅ Mantido sem alterações (já funciona perfeitamente)

## 🚀 Como usar

### Teste Local
```bash
# Inicie o servidor
npm run dev

# Teste subdomínios
http://meucliente.localhost:3000
http://demo.localhost:3000
```

### Compatibilidade
URLs antigas redirecionam automaticamente:
- `vocelab.com.br/in/meucliente` → `meucliente.vocelab.com.br`
- `vocelab.com.br/in/meucliente/dashboard` → `meucliente.vocelab.com.br/dashboard`

### Subdomínios Reservados
Não funcionam como tenant: `www`, `app`, `api`, `static`, `assets`

## 📋 Deploy na Vercel

1. **Adicione os domínios:**
   - `vocelab.com.br`
   - `*.vocelab.com.br`

2. **Configure a variável de ambiente:**
   ```
   BASE_DOMAIN=vocelab.com.br
   ```

3. **Remova o vercel.json** (não precisa mais de rewrites)

## ✅ Pronto!

O sistema agora funciona com subdomínios mantendo total compatibilidade com o código existente. Simples e eficiente! 🎉
