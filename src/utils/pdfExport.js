import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional PDF certificate
 * matching the Receita Federal official statement format.
 * @param {Object} data Normalized CNPJ data object
 */
export function generateCNPJPDF(data) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Colors
  const primaryColor = [15, 23, 42]; // #0f172a slate-900
  const secondaryColor = [51, 65, 85]; // #334155 slate-700
  const accentColor = [37, 99, 235]; // #2563eb blue-600
  const borderColor = [203, 213, 225]; // #cbd5e1 slate-300

  // Outer Border Box
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.4);

  // Header Title
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 22, 'F');
  doc.rect(margin, y, contentWidth, 22, 'S');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('REPÚBLICA FEDERATIVA DO BRASIL', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFontSize(9);
  doc.text('CADASTRO NACIONAL DA PESSOA JURÍDICA', pageWidth / 2, y + 11, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text('COMPROVANTE DE INSCRIÇÃO E DE SITUAÇÃO CADASTRAL', pageWidth / 2, y + 17, { align: 'center' });

  y += 26;

  // Helper for drawing field box
  const drawField = (x, startY, width, height, title, value, isBold = false) => {
    doc.setDrawColor(...borderColor);
    doc.setFillColor(255, 255, 255);
    doc.rect(x, startY, width, height, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...secondaryColor);
    doc.text(title.toUpperCase(), x + 2, startY + 4);

    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);

    // Truncate long lines if needed
    const maxValWidth = width - 4;
    const splitVal = doc.splitTextToSize(String(value || 'NÃO INFORMADO'), maxValWidth);
    doc.text(splitVal[0] || '', x + 2, startY + 9);
    if (splitVal[1] && height > 12) {
      doc.text(splitVal[1], x + 2, startY + 13);
    }
  };

  // Row 1: CNPJ & Data de Abertura
  const col1W = 135;
  const col2W = contentWidth - col1W;
  drawField(margin, y, col1W, 12, 'NÚMERO DE INSCRIÇÃO (CNPJ)', data.cnpj, true);
  drawField(margin + col1W, y, col2W, 12, 'DATA DE ABERTURA', data.dataAbertura || 'NÃO INFORMADA');
  y += 14;

  // Row 2: NOME EMPRESARIAL (Razão Social)
  drawField(margin, y, contentWidth, 12, 'NOME EMPRESARIAL (RAZÃO SOCIAL)', data.razaoSocial, true);
  y += 14;

  // Row 3: NOME FANTASIA
  drawField(margin, y, contentWidth, 12, 'TITULO DO ESTABELECIMENTO (NOME FANTASIA)', data.nomeFantasia);
  y += 14;

  // Row 4: Porte & Natureza Jurídica
  const halfW = contentWidth / 2;
  drawField(margin, y, halfW, 12, 'PORTE DA EMPRESA', data.porte);
  drawField(margin + halfW, y, halfW, 12, 'NATUREZA JURÍDICA', data.naturezaJuridica);
  y += 14;

  // Row 5: CNAE Principal
  const cnaePText = data.cnaePrincipal ? `${data.cnaePrincipal.codigo} - ${data.cnaePrincipal.descricao}` : 'NÃO INFORMADO';
  drawField(margin, y, contentWidth, 14, 'CÓDIGO E DESCRIÇÃO DA ATIVIDADE ECONÔMICA PRINCIPAL', cnaePText);
  y += 16;

  // Row 6: CNAE Secundários
  let cnaeSecText = 'NÃO INFORMADO';
  if (data.cnaesSecundarios && data.cnaesSecundarios.length > 0) {
    cnaeSecText = data.cnaesSecundarios
      .slice(0, 4)
      .map(c => `${c.codigo} - ${c.descricao}`)
      .join(' | ');
    if (data.cnaesSecundarios.length > 4) {
      cnaeSecText += ` (+${data.cnaesSecundarios.length - 4} outras atividades)`;
    }
  }
  drawField(margin, y, contentWidth, 14, 'CÓDIGO E DESCRIÇÃO DAS ATIVIDADES ECONÔMICAS SECUNDÁRIAS', cnaeSecText);
  y += 16;

  // Row 7: Logradouro, Número, Complemento
  const w1 = 110;
  const w2 = 30;
  const w3 = contentWidth - w1 - w2;
  drawField(margin, y, w1, 12, 'LOGRADOURO', data.endereco.logradouro);
  drawField(margin + w1, y, w2, 12, 'NÚMERO', data.endereco.numero);
  drawField(margin + w1 + w2, y, w3, 12, 'COMPLEMENTO', data.endereco.complemento || '---');
  y += 14;

  // Row 8: CEP, Bairro, Municipio, UF
  const cepW = 35;
  const bairroW = 55;
  const ufW = 20;
  const muniW = contentWidth - cepW - bairroW - ufW;
  drawField(margin, y, cepW, 12, 'CEP', data.endereco.cep || '---');
  drawField(margin + cepW, y, bairroW, 12, 'BAIRRO / DISTRITO', data.endereco.bairro || '---');
  drawField(margin + cepW + bairroW, y, muniW, 12, 'MUNICÍPIO', data.endereco.municipio || '---');
  drawField(margin + cepW + bairroW + muniW, y, ufW, 12, 'UF', data.endereco.uf || '---');
  y += 14;

  // Row 9: E-mail, Telefone, Capital Social
  const thirdW = contentWidth / 3;
  drawField(margin, y, thirdW, 12, 'ENDEREÇO ELETRÔNICO (E-MAIL)', data.contato.email);
  drawField(margin + thirdW, y, thirdW, 12, 'TELEFONE', data.contato.telefone);
  drawField(margin + thirdW * 2, y, thirdW, 12, 'CAPITAL SOCIAL', data.capitalSocial);
  y += 14;

  // Row 10: Situação Cadastral & Data da Situação
  const sitW = 120;
  const dateW = contentWidth - sitW;
  drawField(margin, y, sitW, 12, 'SITUAÇÃO CADASTRAL', data.situacaoCadastral, true);
  drawField(margin + sitW, y, dateW, 12, 'DATA DA SITUAÇÃO CADASTRAL', data.dataSituacaoCadastral || 'NÃO INFORMADA');
  y += 16;

  // QSA Section (Quadro de Sócios e Administradores)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text('QUADRO DE SÓCIOS E ADMINISTRADORES (QSA)', margin, y + 4);
  y += 6;

  if (data.qsa && data.qsa.length > 0) {
    const qsaItems = data.qsa.slice(0, 6); // Max 6 in PDF page
    const qsaBoxH = 10;
    qsaItems.forEach((socio) => {
      doc.setDrawColor(...borderColor);
      doc.setFillColor(252, 254, 255);
      doc.rect(margin, y, contentWidth, qsaBoxH, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...primaryColor);
      doc.text(socio.nome, margin + 3, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...secondaryColor);
      doc.text(`Qualificação: ${socio.qualificacao}`, margin + 100, y + 6);
      y += qsaBoxH + 1;
    });
    if (data.qsa.length > 6) {
      doc.setFontSize(7);
      doc.setTextColor(...secondaryColor);
      doc.text(`* E mais ${data.qsa.length - 6} sócio(s) cadastrado(s).`, margin, y + 3);
      y += 5;
    }
  } else {
    doc.setDrawColor(...borderColor);
    doc.rect(margin, y, contentWidth, 8, 'S');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text('Não há informação de quadro de sócios disponível.', margin + 3, y + 5);
    y += 10;
  }

  // Footer Metadata
  y = 280; // bottom of A4
  doc.setDrawColor(...borderColor);
  doc.line(margin, y - 4, pageWidth - margin, y - 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Emitido em: ${new Date().toLocaleString('pt-BR')} | Fonte: ${data.meta.provider}`, margin, y);
  doc.text('Documento gerado via Consulta CNPJ Pro - Antigravity AI', pageWidth - margin, y, { align: 'right' });

  // Save PDF
  const filename = `Comprovante_CNPJ_${data.cnpjRaw}.pdf`;
  doc.save(filename);
}
