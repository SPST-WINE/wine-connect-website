'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

/* ===================== THEME ===================== */
const WC_BLUE_SOFT = '#1c3e5e';
const WC_PINK = '#E33955';

/* Logo files in /public */
const LOGO_SVG = '/wc-logo.svg';
const LOGO_PNG = '/wc-logo.png';

/* ===================== I18N ===================== */
const I18N = {
  it: {
    hero_kicker: 'Matchmaking cantine ↔ buyer',
    hero_title_a: 'Il tuo ponte verso buyer internazionali,',
    hero_title_b: 'senza frizioni.',
    hero_desc:
      'Wine Connect seleziona cantine italiane e le abbina a buyer esteri in base a stile, volume e prezzo. Con SPST gestiamo documenti, accise e spedizioni end-to-end.',
    buyers: {
      kicker: 'Per i Buyer',
      title: 'Cantine italiane selezionate',
      points: [
        'Brief → Shortlist → Kit degustazione',
        'Prezzi allineati al tuo FOB',
        'Documenti e spedizioni gestiti',
      ],
      cta1: 'Wine Connect for Buyers',
      cta2: 'Come funziona',
    },
    wineries: {
      kicker: 'Per le Cantine',
      title: 'Nuovi mercati, meno attrito',
      points: [
        'Buyer
