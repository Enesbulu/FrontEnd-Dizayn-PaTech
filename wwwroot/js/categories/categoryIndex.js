$(document).ready(function () {
    ///DataTable'ın dilini ayarlıyoruz.
    const dataTable = $('#categoryTable').DataTable({   // dataTable ın dil özelliğini değiştirme
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.22/i18n/Turkish.json"
        }
    });

    const placeHolderDiv = $('#modalPlaceHolder');

    /* Add */

    /// Add-Get  -- Ajax ile GET işlemi yapıcaz ve modalı doldurcaz. İşlem Yeni kategori oluşturma.Boş modal açılır.
    $(function () {
        const url = "/Categories/Categories/Add"; // Tetiklenecek action yolunu atanıyor.
        const placeHolderDiv = $('#modalPlaceHolder'); // Etkilenecek olan div'in id'si atanıyor.

        // '.btn-add' sınıfına sahip butona tıklandığında...
        $(document).on('click', '.btn-add', function (event) {
            event.preventDefault(); // Mevcut bütün özellikleri sıfırla.
            // Ajax isteği gönder
            $.get(url)
                .done(function (data) { // İstek başarılı olduğunda yapılacak işlemler
                    placeHolderDiv.html(data); // Belirttiğimiz div'in içerisine gelen veriyi yerleştir
                    placeHolderDiv.find('.modal').modal('show'); // Div'i görünür yap
                })
                .fail(function () { // İstekte hata olursa çalışacak kısım
                    toastr.error("Bir hata meydana geldi!");
                });
        });
    });

    ///Add-Post -- Ekleme işlemi için modal içerisine girilen verileri post eden ve ui guncelleyen script.
    placeHolderDiv.on('click', '#btnAdd', function (event) {
        event.preventDefault();

        const form = $('#form-category-Add');
        const actionUrl = form.attr('action');
        const dataToSend = form.serialize();
        $.post(actionUrl, dataToSend).done(function (data) {

            const categoryAddAjaxModel = jQuery.parseJSON(data);

            const newFormBody = $('.modal-body', categoryAddAjaxModel.CategoryAddPartial);
            placeHolderDiv.find('.modal-body').replaceWith(newFormBody);
            const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';

            if (isValid) {
                const id = categoryAddAjaxModel.CategoryGetDto.Id;  //Muhtemel hata yeri
                const tableRow = $(`[name="${id}"]`);
                placeHolderDiv.find('.modal').modal('hide');
                dataTable.row(tableRow).data([
                    categoryAddAjaxModel.CategoryGetDto.Id,
                    categoryAddAjaxModel.CategoryGetDto.Name,
                    categoryAddAjaxModel.CategoryGetDto.Description,
                    `<button class="btn btn-warning btn-sm btn-update" data-id="${id}"><i class="fas fa-edit"></i></button>`
                ]);

                tableRow.attr("name", `${id}`);
                dataTable.row(tableRow).invalidate();
                toastr.success("Kategori Eklendi", "Başarılı İşlem!");
            }
            else {
                let summaryText = "";
                $("#validation-summary > ul > li").each(function () {
                    let text = $(this).text();
                    summaryText = `*${text}\n`;
                });
                toastr.warning(summaryText);
            }


        }).fail(function (response) {
            toastr.error("Bir hata meydana geldi");
        });
    });



    /*Update */

    /// Get-Update -- Ajax ile GET işlemi yapıcaz ve modalı doldurcaz.Dolu olarak modal açılır.
    $(function () {
        const url = "/Categories/Categories/Update/" //tetiklenecek action yolu atanıyor.
        const placeHolderDiv = $('#modalPlaceHolder');   //etkilenecek olan div'in id'si atanıyor.
        $(document).on('click',
            '.btn-update',
            function (event) { //'btn-update' özelliğine sahip butona tıklandığında..
                event.preventDefault(); //mevcut bütün özellikleri sıfırla.
                const id = $(this).attr('data-id'); //ilgili div in id değerini alma.
                //Ajax da jquery istek atma şekli
                $.get(url, { categoryId: id })
                    .done(function (data) { // istek başarılı olduğunda yapılacak işlemler.
                        placeHolderDiv.html(data); //belirttiğim divin içerisine elimdeki veriyi bastım.
                        placeHolderDiv.find('.modal').modal('show'); //basıldıktan sonra div'i görünür yapıyoruz.
                    }).fail(function () { //istekte hata olursa çalışacak kısım.Done'a alternatif durumdur.
                        toastr.error("Bir hata meydana geldi!");
                    });
            });
    });

    ///Post-Update -- Ajac ile Post işlemi yapılıyor. Modal içerisinde güncellenen verileri post ile gönderiri ve ui da günceller.
    placeHolderDiv.on('click', '#btnUpdate', function (event) {
        event.preventDefault();

        const form = $('#form-category-update');
        const actionUrl = form.attr('action');
        const dataToSend = form.serialize();
        $.post(actionUrl, dataToSend).done(function (data) {
            const categoryUpdateAjaxModel = jQuery.parseJSON(data);
            const newFormBody = $('.modal-body', categoryUpdateAjaxModel.CategoryUpdatePartial);
            placeHolderDiv.find('.modal-body').replaceWith(newFormBody);
            const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';

            if (isValid) {
                const id = categoryUpdateAjaxModel.CategoryGetDto.Id;
                const tableRow = $(`[name="${id}"]`);
                placeHolderDiv.find('.modal').modal('hide');
                dataTable.row(tableRow).data([
                    categoryUpdateAjaxModel.CategoryGetDto.Id,
                    categoryUpdateAjaxModel.CategoryGetDto.Name,
                    categoryUpdateAjaxModel.CategoryGetDto.Description,
                    `<button class="btn btn-warning btn-sm btn-update" data-id="${id}"><i class="fas fa-edit"></i></button>`
                ]);

                tableRow.attr("name", `${id}`);
                dataTable.row(tableRow).invalidate();
                toastr.success("Kategori Güncellendi", "Başarılı İşlem!");
            }
            else {
                let summaryText = "";
                $("#validation-summary > ul > li").each(function () {
                    let text = $(this).text();
                    summaryText = `*${text}\n`;
                });
                toastr.warning(summaryText);
            }


        }).fail(function (response) {
            toastr.error("Bir hata meydana geldi");
        });
    });



    /*Delete */
    //const dataTable = $('#articleTable').DataTable({
    //    "language": {
    //        "url": "//cdn.datatables.net/plug-ins/1.10.22/i18n/Turkish.json"
    //    }
    //});

    $(document).on("click", ".btn-delete", function (event) {
        event.preventDefault();
        const id = $(this).attr("data-id");
        const tableRow = $(`[name="${id}"]`);
        const categoryName = tableRow.find("td:eq(1)").text();
        Swal.fire({
            title: "Silmek istediğinize emin misiniz?",
            text: `${categoryName} adlı makale silinicektir!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Evet, silmek istiyorum.",
            cancelButtonText: "Hayır, silmek istemiyorum.",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "DELETE",
                    dataType: "json",
                    data: { categoryId: id },
                    url: "/Categories/Categories/Delete/{categoryId}",
                    success: function (data) {
                        if (data.isSuccess) {

                            Swal.fire(
                                'Silindi',
                                `${data.data.title} adlı kategori silindi.`,
                                'success'
                            )
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Başarısız!",
                                text: "Kategori silinemedi."
                            })
                        }

                        dataTable.row(tableRow).remove().draw();
                    },
                    error: function (err) {
                        toastr.error(`${err.responseText}`, "Hata!");
                    },
                });
            }
        });
    });



});


