SET check_function_bodies = false;
CREATE TABLE public.bills (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    bill_name text NOT NULL,
    due_date date NOT NULL,
    category text NOT NULL,
    is_repeatable boolean NOT NULL,
    repeat_up_to date,
    repeat_forever boolean,
    repeat_type text,
    event_calendar_id text,
    user_id uuid NOT NULL,
    observations text,
    bill_value numeric NOT NULL
);
CREATE TABLE public.additional_salaries (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    date date NOT NULL,
    value numeric NOT NULL,
    user_id uuid NOT NULL
);
CREATE TABLE public.payments (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    date date NOT NULL,
    value numeric NOT NULL,
    bill_id uuid NOT NULL,
    is_paid boolean NOT NULL,
    is_delayed boolean DEFAULT false NOT NULL,
    user_id uuid NOT NULL
);
CREATE TABLE public.repeat_type (
    type text NOT NULL
);
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    salary numeric
);
ALTER TABLE ONLY public.additional_salaries
    ADD CONSTRAINT additional_salaries_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (date, bill_id);
ALTER TABLE ONLY public.repeat_type
    ADD CONSTRAINT repeat_type_pkey PRIMARY KEY (type);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_username_key UNIQUE (username);
ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_repeat_type_fkey FOREIGN KEY (repeat_type) REFERENCES public.repeat_type(type) ON UPDATE RESTRICT ON DELETE RESTRICT;
