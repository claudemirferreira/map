var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display categoria page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM categoria ORDER BY id_categoria desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/categoria/index.ejs
            res.render('categoria',{data:''});   
        } else {
            // render to views/categoria/index.ejs
            res.render('categoria',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('categoria/add', {
        nome: '',
        author: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let nome = req.body.nome;
    let errors = false;

    if(nome.length === 0 ) {
        errors = true;
        // render to add.ejs with flash message
        res.render('categoria/add', {
            nome: nome
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nome: nome
        }
        
        // insert query
        dbConn.query('INSERT INTO categoria SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('categoria/add', {
                    nome: form_data.nome                  
                })
            } else {                
                req.flash('success', 'categoria successfully added');
                res.redirect('/categoria');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id_categoria)', function(req, res, next) {

    let id_categoria = req.params.id_categoria;
   
    dbConn.query('SELECT * FROM categoria WHERE id_categoria = ' + id_categoria, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'categoria not found with id_categoria = ' + id_categoria)
            res.redirect('/categoria')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('categoria/edit', {
                title: 'Edit categoria', 
                id_categoria: rows[0].id_categoria,
                nome: rows[0].nome
            })
        }
    })
})

// update book data
router.post('/update/:id_categoria', function(req, res, next) {

    let id_categoria = req.params.id_categoria;
    let nome = req.body.nome;
    let errors = false;

    if(nome.length === 0 ) {
        errors = true;
        // render to add.ejs with flash message
        res.render('categoria/edit', {
            id_categoria: req.params.id_categoria,
            nome: nome
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            nome: nome
        }
        // update query
        dbConn.query('UPDATE categoria SET ? WHERE id_categoria = ' + id_categoria, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('categoria/edit', {
                    id_categoria: req.params.id_categoria,
                    nome: form_data.nome
                })
            } else {
                req.flash('success', 'categoria successfully updated');
                res.redirect('/categoria');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id_categoria)', function(req, res, next) {

    let id_categoria = req.params.id_categoria;
     
    dbConn.query('DELETE FROM categoria WHERE id_categoria = ' + id_categoria, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to categoria page
            res.redirect('/categoria')
        } else {
            // set flash message
            req.flash('success', 'categoria successfully deleted! ID = ' + id_categoria)
            // redirect to categoria page
            res.redirect('/categoria')
        }
    })
})

module.exports = router;