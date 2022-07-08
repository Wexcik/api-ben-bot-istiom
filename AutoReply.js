const Settings = require("./settings")
module.exports = {
    üyeBelirt: `${Settings.iptalEmoji} \`Üye Belirtilmedi.\` Geçerli bir **Üye belirt** ve tekrar dene.`,
    rolBelirt: `${Settings.iptalEmoji} \`Rol Belirtilmedi.\` Geçerli bir **Rol belirt** ve tekrar dene.`,
    isimBelirt: `${Settings.iptalEmoji} \`İsim Belirtilmedi.\` Geçerli bir **İsim belirt** ve tekrar dene.`,
    yasBelirt: `${Settings.iptalEmoji} \`Yaş Belirtilmedi.\` Geçerli bir **Yas belirt** ve tekrar dene.`,
    zatenKayıtlı: `${Settings.iptalEmoji} \`Zaten Kayıtlı.\` Belirttiğin üye zaten **Kayıtlı**.`,
    rolVar: `${Settings.iptalEmoji} \`Hatalı İşlem.\` Belirttiğin üyede zaten belirttiğin rol **var**.`,
    rolYok: `${Settings.iptalEmoji} \`Hatalı İşlem.\` Belirttiğin üyede zaten belirttiğin rol **yok**.`,
    isimBelirtKomut: `${Settings.iptalEmoji} \`Komut Belirtilmedi.\` Geçerli bir **Komut Adı belirt** ve tekrar dene.`,
    
    zatenvarKomut: `${Settings.iptalEmoji} Belirttiğin isimde bir komut bulunmakta \`.özelkomut güncelle\` komutu ile komutu güncelleyebilirsin.`,
    özelKomutHata: `${Settings.iptalEmoji} Hatalı Kullanım. [\`.özelkomut oluştur komutAd @verilecekRol verilecekRol2 - @kullanacakYetkiliRol @rol2 - @kişi @kişi2\`]`,
    aynıüstYT: `${Settings.iptalEmoji} Belirttiğin kişi senden **Üst bir yetkide veya aynı yetkide ** oldugu için işlem iptal edildi.`,
    puanBelirt: `${Settings.iptalEmoji} Geçerli bir **Puan belirt** ve tekrar dene.`,
    görevverTür: `${Settings.iptalEmoji} Geçerli bir **Görev türü belirt** ve tekrar dene. [\`davet, mesaj, ses, taglı, teyit\`]`,
    görevverMiktar: `${Settings.iptalEmoji} Geçerli bir **Miktar belirt** ve tekrar dene.`,
    görevverYöntem: `${Settings.iptalEmoji} Geçerli bir **Süre belirt** ve tekrar dene. [\`1h (saat) - 1d (gün) - 1w (hafta) - 1M (ay)\`]`,
  }