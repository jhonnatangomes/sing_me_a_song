--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    name text NOT NULL,
    youtube_link text NOT NULL,
    score integer NOT NULL
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: recommendations_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations_genres (
    id integer NOT NULL,
    recommendation_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.recommendations_genres OWNER TO postgres;

--
-- Name: recommendations_genres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendations_genres_id_seq OWNER TO postgres;

--
-- Name: recommendations_genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_genres_id_seq OWNED BY public.recommendations_genres.id;


--
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendations_id_seq OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- Name: recommendations_genres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations_genres ALTER COLUMN id SET DEFAULT nextval('public.recommendations_genres_id_seq'::regclass);


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (id, name) FROM stdin;
1	Forró
2	Lo-fi
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, name, youtube_link, score) FROM stdin;
2	Falamansa - Xote dos Milagres	https://www.youtube.com/watch?v=chwyjJbcs1Y	0
3	lofi hip hop radio - beats to relax/study to	https://www.youtube.com/watch?v=5qap5aO4i9A	2
\.


--
-- Data for Name: recommendations_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations_genres (id, recommendation_id, genre_id) FROM stdin;
2	2	1
3	3	2
\.


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_id_seq', 2, true);


--
-- Name: recommendations_genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_genres_id_seq', 3, true);


--
-- Name: recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_id_seq', 3, true);


--
-- Name: genres genres_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pk PRIMARY KEY (id);


--
-- Name: recommendations_genres recommendations_genres_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations_genres
    ADD CONSTRAINT recommendations_genres_pk PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pk PRIMARY KEY (id);


--
-- Name: recommendations_genres recommendations_genres_fk0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations_genres
    ADD CONSTRAINT recommendations_genres_fk0 FOREIGN KEY (recommendation_id) REFERENCES public.recommendations(id);


--
-- Name: recommendations_genres recommendations_genres_fk1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations_genres
    ADD CONSTRAINT recommendations_genres_fk1 FOREIGN KEY (genre_id) REFERENCES public.genres(id);


--
-- PostgreSQL database dump complete
--

