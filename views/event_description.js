<% layout('includes/layout') %>

<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-10">
        <h2>Admin</h2>
        <ol class="breadcrumb">
            <li>
                <a href="dashboard">Home</a>
            </li>
            <li class="active">
               <strong>Event Detail</strong>
          </li>
      </ol>
  </div>
</div>


<div class="wrapper wrapper-content  animated fadeInRight">

<% for(var i = 0 ; i < events.length ; i++){ %>
<div class="row">
<div class="col-sm-4">
                    <div class="ibox ">

                        <div class="ibox-content">
                            <div class="tab-content">
                              <div id="contact-1" class="tab-pane active">
                                    <div class="row m-b-lg">
                                        <div class="col-lg-4 ">
                                            <h2>Details</h2>

                                            <div class="m-b-sm">
                                             <img class="" src="{{$event->image}}" style="width: 270px; height: 270px;">
                                             <div class="col-lg-12" style="width: 270px;margin: 13px 0px 0px 0px;text-align: center;">
                                             <p><b><%= events[i].name%></b></p>
                                         </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            </div>
                            </div>

            </div>
<div class="col-sm-8">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
            <h5>Details</h5>
           <a href="/admin/edit_events/<%=events[i].id%>">
            <button type="button" class="btn btn-success" style="float: right;margin-top: -9px;padding: 6px;width: 68px;background-color:#10CDDA ;border-color:#10CDDA ;">
              Edit</button></a>

        </div>

        <div class="ibox-content">

            <table class="table">

             <tbody>
              <tr>
                 <td><a data-toggle="tab" href="#contact-1" class="client-link"> Category: </a></td>
                 <td>  <%= events[i].event_name %></td>
             </tr>

         </tbody>
     </table>

 </div>

</div>
</div>
</div>
@endforeach
</div>

@endsection
