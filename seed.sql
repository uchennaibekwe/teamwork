-- USER TABLE
CREATE TABLE users
(
    id serial NOT NULL,
    firstname text COLLATE pg_catalog."default" NOT NULL,
    lastname text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    gender text COLLATE pg_catalog."default" NOT NULL,
    jobrole text COLLATE pg_catalog."default" NOT NULL,
    department text COLLATE pg_catalog."default" NOT NULL,
    address text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

-- GIFS TABLE

CREATE TABLE gifs
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    image_url text COLLATE pg_catalog."default" NOT NULL,
    created_on timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT gifs_pkey PRIMARY KEY (id)
)

-- ARTICLES TABLE
CREATE TABLE public.articles
(
    id serial NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    article text COLLATE pg_catalog."default" NOT NULL,
    created_on timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id integer NOT NULL,
    CONSTRAINT articles_pkey PRIMARY KEY (id),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
        NOT VALID
)

-- ARTICLES COMMENTS
CREATE TABLE public.article_comments
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    article_id integer NOT NULL,
    comment text COLLATE pg_catalog."default" NOT NULL,
    flag boolean,
    created_on timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "articleComment_pkey" PRIMARY KEY (id),
    CONSTRAINT "articleComment_article_id_fkey" FOREIGN KEY (article_id)
        REFERENCES public.articles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "articleComment_user_id_fkey" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)


-- GIF COMMENTS
CREATE TABLE public.gif_comments
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    gif_id integer NOT NULL,
    comment text COLLATE pg_catalog."default" NOT NULL,
    flag boolean,
    created_on time without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "gifComment_pkey" PRIMARY KEY (id),
    CONSTRAINT "gifComment_gif_id_fkey" FOREIGN KEY (gif_id)
        REFERENCES public.gifs (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "gifComment_user_id_fkey" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)
