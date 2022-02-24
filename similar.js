<% similarRooms.map((s, i) => { %>
    <tr>
        <td><%= i + 1 %></td>
        <td><%= s.title %></td>
        <td>
            <img src="http://localhost:3000/<%= s.imageUrl %>" alt="imageUrl" width="100"/>
        </td>
        <td><%= s.price %></td>
        <td><%= s.city %></td>
        <td><%= s.country %></td>
        <td>
            <form action="/admin/item/detail-item/<%= itemId %>/similar-rooms/<%= s._id %>?_method=DELETE" method="post">
                <a href="javascript:void()" class="btn btn-warning btn-sm text-dark button-update"
                data-id="<%= s._id %>" data-title="<%=s.title %>" data-price="<%=s.price %>" data-city="<%=s.city %>" data-country="<%=s.country %>"
                >
                    <i class="fas fa-edit"></i>
                </a>
                <button type="submit" class="btn btn-danger btn-sm button-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </form>
        </td>
    </tr>
    <% }); %>