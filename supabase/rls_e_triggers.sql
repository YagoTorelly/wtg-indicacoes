-- =======================================================
-- WTG Indicações — Políticas de segurança RLS (Supabase)
-- Execute no SQL Editor do Supabase
-- =======================================================

-- -------------------------------------------------------
-- MIGRATION: coluna de observações (execute uma vez)
-- -------------------------------------------------------
ALTER TABLE indications
  ADD COLUMN IF NOT EXISTS observacoes JSONB NOT NULL DEFAULT '[]'::jsonb;


-- -------------------------------------------------------
-- TABELA: profiles
-- -------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuário vê apenas o próprio perfil
CREATE POLICY "perfil_select_proprio"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admin vê todos os perfis
CREATE POLICY "perfil_select_admin"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'admin@wtgseguros.com.br'
    )
  );

-- Usuário atualiza apenas o próprio perfil
CREATE POLICY "perfil_update_proprio"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin atualiza qualquer perfil
CREATE POLICY "perfil_update_admin"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'admin@wtgseguros.com.br'
    )
  );

-- -------------------------------------------------------
-- TABELA: indications
-- -------------------------------------------------------

ALTER TABLE indications ENABLE ROW LEVEL SECURITY;

-- SELECT: user vê apenas as suas; admin vê todas
CREATE POLICY "indicacao_select"
  ON indications FOR SELECT
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'admin@wtgseguros.com.br'
    )
  );

-- INSERT: apenas o próprio usuário pode criar; created_by = auth.uid()
CREATE POLICY "indicacao_insert"
  ON indications FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- UPDATE: user só edita as suas; admin edita todas
CREATE POLICY "indicacao_update"
  ON indications FOR UPDATE
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'admin@wtgseguros.com.br'
    )
  );

-- DELETE: user só exclui as suas; admin exclui todas
CREATE POLICY "indicacao_delete"
  ON indications FOR DELETE
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'admin@wtgseguros.com.br'
    )
  );

-- -------------------------------------------------------
-- TRIGGER: preencher created_by automaticamente no INSERT
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION preencher_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_preencher_created_by
  BEFORE INSERT ON indications
  FOR EACH ROW EXECUTE FUNCTION preencher_created_by();

-- -------------------------------------------------------
-- TRIGGER: atualizar ultima_atualizacao automaticamente
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION atualizar_ultima_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ultima_atualizacao := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ultima_atualizacao
  BEFORE UPDATE ON indications
  FOR EACH ROW EXECUTE FUNCTION atualizar_ultima_atualizacao();

-- -------------------------------------------------------
-- TRIGGER: preencher data_indicacao automaticamente
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION preencher_data_indicacao()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.data_indicacao IS NULL THEN
    NEW.data_indicacao := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_data_indicacao
  BEFORE INSERT ON indications
  FOR EACH ROW EXECUTE FUNCTION preencher_data_indicacao();

-- -------------------------------------------------------
-- TRIGGER: criar perfil automaticamente ao cadastrar usuário
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION criar_perfil_novo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'admin@wtgseguros.com.br' THEN 'admin' ELSE 'user' END,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_criar_perfil
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION criar_perfil_novo_usuario();
