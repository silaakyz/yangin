CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: arac; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.arac (
    arac_tur_id bigint NOT NULL,
    arac_tur_adi text
);


--
-- Name: arac_arac_tur_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.arac ALTER COLUMN arac_tur_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.arac_arac_tur_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: isletme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.isletme (
    isletme_id bigint NOT NULL,
    isletme_ad text
);


--
-- Name: isletme_arac; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.isletme_arac (
    isletme_arac_id bigint NOT NULL,
    isletme_id bigint,
    arac_tur_id bigint,
    adet bigint
);


--
-- Name: yangin_2023; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.yangin_2023 (
    yangin_id bigint NOT NULL,
    yangin_ay text,
    yangin_il text,
    isletme_id bigint,
    agac_tur text,
    yangin_neden text,
    kullanilan_personel_sayisi bigint
);


--
-- Name: yangin_2024; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.yangin_2024 (
    yangin_id bigint NOT NULL,
    yangin_ay text,
    yangin_il text,
    isletme_id bigint,
    agac_tur text,
    yangin_neden text,
    kullanilan_personel_sayisi bigint
);


--
-- Name: yangin_2025; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.yangin_2025 (
    yangin_id bigint NOT NULL,
    yangin_ay text,
    yangin_il text,
    isletme_id bigint,
    agac_tur text,
    yangin_neden text,
    kullanilan_personel_sayisi bigint
);


--
-- Name: tum_yillar_yangin; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.tum_yillar_yangin WITH (security_invoker='true') AS
 SELECT yangin_2023.yangin_id,
    yangin_2023.isletme_id
   FROM public.yangin_2023
UNION ALL
 SELECT yangin_2024.yangin_id,
    yangin_2024.isletme_id
   FROM public.yangin_2024
UNION ALL
 SELECT yangin_2025.yangin_id,
    yangin_2025.isletme_id
   FROM public.yangin_2025;


--
-- Name: yangin_arac_2023; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.yangin_arac_2023 (
    yangin_arac_id bigint NOT NULL,
    yangin_id bigint,
    arac_tur_id bigint,
    adet bigint
);


--
-- Name: yangin_arac_2024; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.yangin_arac_2024 (
    yangin_arac_id bigint NOT NULL,
    yangin_id bigint,
    arac_tur_id bigint,
    adet bigint
);


--
-- Name: yangin_arac_2025; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.yangin_arac_2025 (
    yangin_arac_id bigint NOT NULL,
    yangin_id bigint,
    arac_tur_id bigint,
    adet bigint
);


--
-- Name: tum_yillar_yangin_arac; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.tum_yillar_yangin_arac WITH (security_invoker='true') AS
 SELECT yangin_arac_2023.yangin_id,
    yangin_arac_2023.arac_tur_id,
    yangin_arac_2023.adet
   FROM public.yangin_arac_2023
UNION ALL
 SELECT yangin_arac_2024.yangin_id,
    yangin_arac_2024.arac_tur_id,
    yangin_arac_2024.adet
   FROM public.yangin_arac_2024
UNION ALL
 SELECT yangin_arac_2025.yangin_id,
    yangin_arac_2025.arac_tur_id,
    yangin_arac_2025.adet
   FROM public.yangin_arac_2025;


--
-- Name: isletme_arac_asimi_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.isletme_arac_asimi_view WITH (security_invoker='true') AS
 SELECT i.isletme_ad,
    COALESCE(sum(ia.adet), (0)::numeric) AS isletme_toplam_arac,
    COALESCE(sum(ya.adet), (0)::numeric) AS yanginda_kullanilan_arac,
    (COALESCE(sum(ya.adet), (0)::numeric) - COALESCE(sum(ia.adet), (0)::numeric)) AS arac_asimi
   FROM (((public.isletme i
     LEFT JOIN public.isletme_arac ia ON ((i.isletme_id = ia.isletme_id)))
     LEFT JOIN public.tum_yillar_yangin ty ON ((i.isletme_id = ty.isletme_id)))
     LEFT JOIN public.tum_yillar_yangin_arac ya ON ((ty.yangin_id = ya.yangin_id)))
  GROUP BY i.isletme_ad;


--
-- Name: isletme_arac_isletme_arac_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.isletme_arac ALTER COLUMN isletme_arac_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.isletme_arac_isletme_arac_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: isletme_isletme_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.isletme ALTER COLUMN isletme_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.isletme_isletme_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: isletme_tehlike_siralama_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.isletme_tehlike_siralama_view WITH (security_invoker='true') AS
 SELECT i.isletme_ad,
        CASE
            WHEN (count(*) > 10) THEN 'Çok Yüksek'::text
            WHEN (count(*) > 5) THEN 'Yüksek'::text
            WHEN (count(*) > 2) THEN 'Orta'::text
            ELSE 'Düşük'::text
        END AS tehlike_turu,
    count(*) AS yangin_sayisi
   FROM (public.tum_yillar_yangin t
     JOIN public.isletme i ON ((t.isletme_id = i.isletme_id)))
  GROUP BY i.isletme_ad;


--
-- Name: tum_yillar_yangin_detay; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.tum_yillar_yangin_detay WITH (security_invoker='true') AS
 SELECT yangin_2023.isletme_id,
    yangin_2023.yangin_neden
   FROM public.yangin_2023
UNION ALL
 SELECT yangin_2024.isletme_id,
    yangin_2024.yangin_neden
   FROM public.yangin_2024
UNION ALL
 SELECT yangin_2025.isletme_id,
    yangin_2025.yangin_neden
   FROM public.yangin_2025;


--
-- Name: isletme_yangin_nedenleri_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.isletme_yangin_nedenleri_view WITH (security_invoker='true') AS
 SELECT i.isletme_ad,
    t.yangin_neden,
    count(*) AS yangin_sayisi
   FROM (public.tum_yillar_yangin_detay t
     JOIN public.isletme i ON ((t.isletme_id = i.isletme_id)))
  GROUP BY i.isletme_ad, t.yangin_neden;


--
-- Name: tehlikeli_yangin_agac_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.tehlikeli_yangin_agac_view WITH (security_invoker='true') AS
 SELECT i.isletme_ad,
    y.agac_tur,
    count(*) AS yangin_sayisi
   FROM (( SELECT yangin_2023.isletme_id,
            yangin_2023.agac_tur
           FROM public.yangin_2023
        UNION ALL
         SELECT yangin_2024.isletme_id,
            yangin_2024.agac_tur
           FROM public.yangin_2024
        UNION ALL
         SELECT yangin_2025.isletme_id,
            yangin_2025.agac_tur
           FROM public.yangin_2025) y
     JOIN public.isletme i ON ((y.isletme_id = i.isletme_id)))
  GROUP BY i.isletme_ad, y.agac_tur;


--
-- Name: yangin_2023_yangin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.yangin_2023 ALTER COLUMN yangin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.yangin_2023_yangin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: yangin_2024_yangin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.yangin_2024 ALTER COLUMN yangin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.yangin_2024_yangin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: yangin_2025_yangin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.yangin_2025 ALTER COLUMN yangin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.yangin_2025_yangin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: yangin_analiz_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.yangin_analiz_view WITH (security_invoker='true') AS
 SELECT yangin_ay,
    isletme_id,
    kullanilan_personel_sayisi,
        CASE
            WHEN (kullanilan_personel_sayisi > 50) THEN 'Yüksek'::text
            WHEN (kullanilan_personel_sayisi > 20) THEN 'Orta'::text
            ELSE 'Düşük'::text
        END AS tehlike_seviyesi
   FROM ( SELECT yangin_2023.yangin_ay,
            yangin_2023.isletme_id,
            yangin_2023.kullanilan_personel_sayisi
           FROM public.yangin_2023
        UNION ALL
         SELECT yangin_2024.yangin_ay,
            yangin_2024.isletme_id,
            yangin_2024.kullanilan_personel_sayisi
           FROM public.yangin_2024
        UNION ALL
         SELECT yangin_2025.yangin_ay,
            yangin_2025.isletme_id,
            yangin_2025.kullanilan_personel_sayisi
           FROM public.yangin_2025) all_fires;


--
-- Name: yangin_arac_2023_yangin_arac_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.yangin_arac_2023 ALTER COLUMN yangin_arac_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.yangin_arac_2023_yangin_arac_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: yangin_arac_2024_yangin_arac_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.yangin_arac_2024 ALTER COLUMN yangin_arac_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.yangin_arac_2024_yangin_arac_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: yangin_arac_2025_yangin_arac_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.yangin_arac_2025 ALTER COLUMN yangin_arac_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.yangin_arac_2025_yangin_arac_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: arac arac_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.arac
    ADD CONSTRAINT arac_pkey PRIMARY KEY (arac_tur_id);


--
-- Name: isletme_arac isletme_arac_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.isletme_arac
    ADD CONSTRAINT isletme_arac_pkey PRIMARY KEY (isletme_arac_id);


--
-- Name: isletme isletme_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.isletme
    ADD CONSTRAINT isletme_pkey PRIMARY KEY (isletme_id);


--
-- Name: yangin_2023 yangin_2023_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_2023
    ADD CONSTRAINT yangin_2023_pkey PRIMARY KEY (yangin_id);


--
-- Name: yangin_2024 yangin_2024_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_2024
    ADD CONSTRAINT yangin_2024_pkey PRIMARY KEY (yangin_id);


--
-- Name: yangin_2025 yangin_2025_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_2025
    ADD CONSTRAINT yangin_2025_pkey PRIMARY KEY (yangin_id);


--
-- Name: yangin_arac_2023 yangin_arac_2023_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2023
    ADD CONSTRAINT yangin_arac_2023_pkey PRIMARY KEY (yangin_arac_id);


--
-- Name: yangin_arac_2024 yangin_arac_2024_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2024
    ADD CONSTRAINT yangin_arac_2024_pkey PRIMARY KEY (yangin_arac_id);


--
-- Name: yangin_arac_2025 yangin_arac_2025_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2025
    ADD CONSTRAINT yangin_arac_2025_pkey PRIMARY KEY (yangin_arac_id);


--
-- Name: isletme_arac isletme_arac_arac_tur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.isletme_arac
    ADD CONSTRAINT isletme_arac_arac_tur_id_fkey FOREIGN KEY (arac_tur_id) REFERENCES public.arac(arac_tur_id);


--
-- Name: isletme_arac isletme_arac_isletme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.isletme_arac
    ADD CONSTRAINT isletme_arac_isletme_id_fkey FOREIGN KEY (isletme_id) REFERENCES public.isletme(isletme_id);


--
-- Name: yangin_2023 yangin_2023_isletme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_2023
    ADD CONSTRAINT yangin_2023_isletme_id_fkey FOREIGN KEY (isletme_id) REFERENCES public.isletme(isletme_id);


--
-- Name: yangin_2024 yangin_2024_isletme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_2024
    ADD CONSTRAINT yangin_2024_isletme_id_fkey FOREIGN KEY (isletme_id) REFERENCES public.isletme(isletme_id);


--
-- Name: yangin_2025 yangin_2025_isletme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_2025
    ADD CONSTRAINT yangin_2025_isletme_id_fkey FOREIGN KEY (isletme_id) REFERENCES public.isletme(isletme_id);


--
-- Name: yangin_arac_2023 yangin_arac_2023_arac_tur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2023
    ADD CONSTRAINT yangin_arac_2023_arac_tur_id_fkey FOREIGN KEY (arac_tur_id) REFERENCES public.arac(arac_tur_id);


--
-- Name: yangin_arac_2023 yangin_arac_2023_yangin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2023
    ADD CONSTRAINT yangin_arac_2023_yangin_id_fkey FOREIGN KEY (yangin_id) REFERENCES public.yangin_2023(yangin_id);


--
-- Name: yangin_arac_2024 yangin_arac_2024_arac_tur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2024
    ADD CONSTRAINT yangin_arac_2024_arac_tur_id_fkey FOREIGN KEY (arac_tur_id) REFERENCES public.arac(arac_tur_id);


--
-- Name: yangin_arac_2024 yangin_arac_2024_yangin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2024
    ADD CONSTRAINT yangin_arac_2024_yangin_id_fkey FOREIGN KEY (yangin_id) REFERENCES public.yangin_2024(yangin_id);


--
-- Name: yangin_arac_2025 yangin_arac_2025_arac_tur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2025
    ADD CONSTRAINT yangin_arac_2025_arac_tur_id_fkey FOREIGN KEY (arac_tur_id) REFERENCES public.arac(arac_tur_id);


--
-- Name: yangin_arac_2025 yangin_arac_2025_yangin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yangin_arac_2025
    ADD CONSTRAINT yangin_arac_2025_yangin_id_fkey FOREIGN KEY (yangin_id) REFERENCES public.yangin_2025(yangin_id);


--
-- Name: arac Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.arac FOR SELECT USING (true);


--
-- Name: isletme Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.isletme FOR SELECT USING (true);


--
-- Name: isletme_arac Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.isletme_arac FOR SELECT USING (true);


--
-- Name: yangin_2023 Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.yangin_2023 FOR SELECT USING (true);


--
-- Name: yangin_2024 Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.yangin_2024 FOR SELECT USING (true);


--
-- Name: yangin_2025 Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.yangin_2025 FOR SELECT USING (true);


--
-- Name: yangin_arac_2023 Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.yangin_arac_2023 FOR SELECT USING (true);


--
-- Name: yangin_arac_2024 Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.yangin_arac_2024 FOR SELECT USING (true);


--
-- Name: yangin_arac_2025 Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.yangin_arac_2025 FOR SELECT USING (true);


--
-- Name: arac; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.arac ENABLE ROW LEVEL SECURITY;

--
-- Name: isletme; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.isletme ENABLE ROW LEVEL SECURITY;

--
-- Name: isletme_arac; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.isletme_arac ENABLE ROW LEVEL SECURITY;

--
-- Name: yangin_2023; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.yangin_2023 ENABLE ROW LEVEL SECURITY;

--
-- Name: yangin_2024; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.yangin_2024 ENABLE ROW LEVEL SECURITY;

--
-- Name: yangin_2025; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.yangin_2025 ENABLE ROW LEVEL SECURITY;

--
-- Name: yangin_arac_2023; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.yangin_arac_2023 ENABLE ROW LEVEL SECURITY;

--
-- Name: yangin_arac_2024; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.yangin_arac_2024 ENABLE ROW LEVEL SECURITY;

--
-- Name: yangin_arac_2025; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.yangin_arac_2025 ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;